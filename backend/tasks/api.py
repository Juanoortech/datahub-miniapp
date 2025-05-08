import datetime
import logging
import os
import random
import uuid
import mimetypes
from codecs import Codec
from typing import List

from asgiref.sync import sync_to_async
from django.core.handlers.asgi import ASGIRequest
from django.core.handlers.wsgi import WSGIRequest
from django.db.models import Count, Avg, QuerySet
from django.forms import model_to_dict
from django.utils import timezone
from ninja import Router, Query
from ninja.pagination import paginate

from accounts.api import authenticate
from accounts.models import User, Transaction, DepositType, TransactionType, TransactionStatus
from accounts.pagination import MyPaginator
from core import settings
from tasks.models import MyFile, Task, Completion, Status, RateRecord
from tasks.schemes import (
    FileOutAWS,
    DetailOut,
    FileIn,
    CompletionStartIn,
    CompletionSendIn,
    CompletionOut,
    TaskOut,
    TaskFilterSchema,
    CompletionValidationIn,
    CompletionFilterSchema, ValidationListTaskOut, CompletionHistoryOut,
)
import aioboto3
from aiobotocore.config import AioConfig

router = Router()


@router.post(
    "/completions/",
    auth=authenticate,
    response={200: CompletionOut, 400: DetailOut},
    summary="Create empty completion",
)
async def start_completion(request: WSGIRequest | ASGIRequest, data: CompletionStartIn):
    try:
        current_user: User = await User.objects.aget(id=request.auth)
        already_started = await Completion.objects.filter(user=request.auth, status=Status.HOLD).aexists()
        # already_started = False
        if not already_started:
            completion_task: Task = await Task.objects.aget(id=data.task_id)
            if await Completion.objects.filter(task=completion_task).acount() > completion_task.limit_completions:
                return 400, {"detail": "Completion limit reached"}
            completion_object: Completion = await Completion.objects.acreate(
                user=current_user,
                task=completion_task,
                file=None,
                completion_date_and_time=datetime.datetime.now(),
                status=Status.HOLD,
            )
            await completion_object.asave()
            return completion_object
        else:
            return 400, {"detail": "Some completion has been already started"}
    except User.DoesNotExist:
        return 400, {"detail": "User does not exist"}


@router.get(
    "/sign-s3/",
    auth=authenticate,
    response={200: FileOutAWS, 400: DetailOut},
    summary="Sign file and get an upload link",
)
async def sign_s3_file(request: WSGIRequest | ASGIRequest, data: Query[FileIn]):
    logging.error(data.file_name)
    logging.error(data.file_type)

    try:
        completion_object: Completion = await Completion.objects.select_related("user", "task", "file").aget(
            id=data.completion_id)
        task: Task = completion_object.task
    except Completion.DoesNotExist:
        return 400, {"detail": "Task does not exist"}

    session = aioboto3.Session()
    new_file: MyFile = await MyFile.objects.acreate(
        original_file_name=data.file_name,
        file_type=os.path.splitext(data.file_name)[1],
        file_uuid=uuid.uuid4(),
    )

    async with session.client(
            service_name="s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            # endpoint_url="https://s3-standard.oortech.com",
            config=AioConfig(
                signature_version="s3v4", region_name=settings.AWS_S3_REGION_NAME
            ),
    ) as s3:
        try:
            url = await s3.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": settings.AWS_STORAGE_BUCKET_NAME,
                    "Key": f"Tasks/{task.id}/{new_file.file_uuid.__str__()}{new_file.file_type}",
                    "ContentType": data.file_type,
                    # "ACL": "public-read",
                },
                ExpiresIn=3600,
                HttpMethod="PUT",
            )
        except Exception as e:
            return 400, {"detail": f"Failed to generate presigned url: {e}"}

    new_file.url = f"{settings.AWS_STATIC_URL}Tasks/{task.id}/{new_file.file_uuid}{new_file.file_type}"
    await new_file.asave()
    return 200, {
        "presigned_url": url,
        "url": new_file.url,
        "file_uuid": new_file.file_uuid,
    }


@router.put(
    "/completions/{completion_id}/",
    auth=authenticate,
    response={200: CompletionOut, 400: DetailOut},
    summary="Send completion with file",
)
async def send_completion(
        request: WSGIRequest | ASGIRequest, completion_id: int, data: CompletionSendIn
):
    try:
        completion_object: Completion = await Completion.objects.select_related(
            "user",
            "task",
            "file"
        ).aget(id=completion_id)
        if completion_object.file is None:
            file_object: MyFile = await MyFile.objects.aget(file_uuid=data.file_uuid)
            logging.error(file_object)
            file_object.upload_finished_at = datetime.datetime.now()
            completion_object.file = file_object
            completion_object.status = Status.IN_REVIEW

            completion_object.task.when_was_sent_to_validation = datetime.datetime.now()
            await completion_object.task.asave()
            await completion_object.asave()
            await file_object.asave()
        else:
            return 400, {"detail": "File already sent"}
    except Completion.DoesNotExist:
        return 400, {"detail": "Completion does not exist"}
    except MyFile.DoesNotExist:
        return 400, {"detail": "File does not exist"}
    return completion_object


@router.delete(
    "/completions/{completion_id}/",
    auth=authenticate,
    response={200: DetailOut, 404: DetailOut},
    summary="Cancel completion if started",
)
async def cancel_completion(
        request: WSGIRequest | ASGIRequest,
        completion_id: int,
):
    try:
        completion_object: Completion = await Completion.objects.aget(id=completion_id)
        await completion_object.adelete()
        return 200, {"detail": "Completion has been cancelled"}
    except Completion.DoesNotExist:
        return 404, {"detail": "No completion found"}


@router.get(
    "/",
    auth=authenticate,
    response=List[TaskOut],
    summary="List of all tasks with filtering",
)
@paginate(MyPaginator)
async def get_list_of_tasks(
        request: WSGIRequest | ASGIRequest, filters: Query[TaskFilterSchema]
):
    logging.error(filters.get_filter_expression())
    tasks = []
    try:
        user: User = await User.objects.aget(id=request.auth)
        async for task in Task.objects.filter(filters.get_filter_expression()).all():
            if not await Completion.objects.filter(task=task, user=user).aexists():
                if not task.task_paused:
                    if task.start_time is None or task.start_time <= timezone.now():
                        tasks.append(task)

    except User.DoesNotExist:
        pass

    return tasks


@router.get(
    "/{task_id}/",
    auth=authenticate,
    response={200: TaskOut, 404: DetailOut},
    summary="Get task info",
)
async def get_task_info(request: WSGIRequest | ASGIRequest, task_id: int):
    try:
        task: Task = await Task.objects.aget(id=task_id)
    except Task.DoesNotExist:
        return 404, {"detail": "Task does not exist"}
    return task


@router.get(
    "/completions/{completion_id}",
    auth=authenticate,
    response={200: CompletionOut, 404: DetailOut},
    summary="Get completion info",
)
async def get_completion_info(request: WSGIRequest | ASGIRequest, completion_id: int):
    try:
        completion: Completion = await Completion.objects.aget(id=completion_id)
    except Completion.DoesNotExist:
        return 404, {"detail": "No completion found"}
    return completion


@router.get(
    "/completions/",
    auth=authenticate,
    response={200: List[CompletionHistoryOut], 404: DetailOut},
    summary="Get list of user completions and validations",
)
@paginate(MyPaginator)
async def get_list_of_completions(
        request: WSGIRequest | ASGIRequest, filters: Query[CompletionFilterSchema]
):
    try:
        current_user: User = await User.objects.aget(id=request.auth)
        logging.error(filters.get_filter_expression())
        completions = []

        parse_comma_list = lambda x: [v for v in (v.strip() for v in x.split(",")) if v]
        parsed_task_type = parse_comma_list(filters.task_type) if filters.task_type else None

        if parsed_task_type is None or "Task" in parsed_task_type:
            async for completion in (
                    Completion.objects.select_related("user", "task", "file")
                            .filter(user=current_user)
                            .filter(filters.get_filter_expression())
            ):
                completions.append({
                    "completion": completion,
                    "task_type": "Task",
                    "date": completion.completion_date_and_time
                })

        if parsed_task_type is None or "Validation" in parsed_task_type:
            async for rate_record in RateRecord.objects.select_related(
                    "completion",
                    "completion__user",
                    "completion__task",
                    "completion__file"
            ).filter(validator=current_user):
                completion = rate_record.completion

                if filters.status is None or completion.status in filters.status:
                    completions.append({
                        "completion": completion,
                        "task_type": "Validation",
                        "date": rate_record.created_at
                    })

        completions_sorted = []
        if completions:
            completions_sorted = sorted(completions, key=lambda x: x["date"])
        return completions_sorted
    except User.DoesNotExist:
        return 404, {"detail": "No completion found"}


@router.get(
    "/validations/completions/",
    auth=authenticate,
    response=List[ValidationListTaskOut],
    summary="List of all tasks with at least one completion to validate",
)
@paginate(MyPaginator)
async def get_list_of_tasks_to_validate(
        request: WSGIRequest | ASGIRequest, filters: Query[TaskFilterSchema]
):
    tasks = []
    try:
        user: User = await User.objects.aget(id=request.auth)
        async for task in Task.objects.filter(filters.get_filter_expression()).all():
            pool = await task.get_validation_pool_without_current_user(user=user)
            is_suitable = await task.is_suitable_to_be_validated(
                user=user)  # Позволяет не выводить таск, который пользователь уже валидировал

            if pool and is_suitable:
                if not task.validation_paused:
                    tasks.append(
                        {
                            "task": task,
                            "available": len(pool),
                        }
                    )
    except User.DoesNotExist:
        return 404, {"detail": "Task does not exist"}

    return tasks


@router.get(
    "/validations/{task_id}/",
    auth=authenticate,
    response={200: CompletionOut, 400: DetailOut, 404: DetailOut},
    summary="Get a completion from task to validate",
)
async def get_completion_to_validate(request: WSGIRequest | ASGIRequest, task_id: int):
    try:
        task: Task = await Task.objects.aget(id=task_id)
        user: User = await User.objects.aget(id=request.auth)
        # max_rates_allowed = task.limit_completions * (task.validation_percent / 100)
        eligible_completions_list = await task.get_validation_pool_without_current_user(user=user)
        if eligible_completions_list:
            random_completion = random.choice(eligible_completions_list)
            return random_completion
    except Task.DoesNotExist:
        return 404, {"detail": "Task not found"}
    except User.DoesNotExist:
        return 404, {"detail": "User not found"}
    return 400, {"detail": "There is no completion to validate"}


@router.post(
    "/validations/completions/{completion_id}/",
    auth=authenticate,
    response={200: CompletionOut, 400: DetailOut, 404: DetailOut},
    summary="Validate task completion and create a rate record",
)
async def validate(
        request: WSGIRequest | ASGIRequest,
        completion_id: int,
        data: CompletionValidationIn,
):
    # TODO: Не забыть добавить таймер на 24ч и админский интерфейс
    try:
        completion_object: Completion = await Completion.objects.select_related(
            "user", "task", "file"
        ).aget(id=completion_id)
        current_user: User = await User.objects.aget(id=request.auth)

        if not await RateRecord.objects.filter(completion_id=completion_id, validator=current_user).aexists():
            new_rate_record: RateRecord = await RateRecord.objects.acreate(
                completion_id=completion_id, score=data.score, validator=current_user
            )

            avg_score = []
            async for i in RateRecord.objects.filter(
                    completion=completion_object
            ).select_related("completion", "validator").values_list("score", flat=True):
                avg_score.append(i)

            completion_object.score = 0
            if avg_score:
                avg = sum(avg_score) / len(avg_score)
                completion_object.score = avg
            await completion_object.asave()

            max_rates_allowed = completion_object.task.limit_completions * (
                    completion_object.task.validation_percent / 100
            )
            completions = Completion.objects.select_related("task", "user", "file").filter(
                task=completion_object.task,
            )
            completions_with_rate_counter = completions.annotate(
                rate_count=Count('completion_rate')
            )
            if await completions_with_rate_counter.filter(
                    rate_count__gte=completion_object.task.validation_limit
            ).acount() >= max_rates_allowed:
                await completions.aupdate(
                    sent_for_manual_validation=True,
                    when_sent_for_validation=timezone.now()
                )

                not_validates_at_all = completions_with_rate_counter.filter(
                    rate_count=0
                )
                async for completion in not_validates_at_all:
                    rate_records = completion.completion_rate.select_related("completion", "validator").all()
                    validators_to_reward = rate_records.filter(score__gte=3).values_list("validator", flat=True)
                    # self._reward_users(completion=completion, user_ids=validators_to_reward, main_user=completion.user.id)

                    main_user = await User.objects.select_related("referral_user").aget(id=completion.user.id)
                    task_reward = completion.task.reward
                    main_user.balance += await sync_to_async(main_user.calculate_bonus)(task_reward)
                    transaction = await Transaction.objects.acreate(
                        user=main_user,
                        sum_of_transaction=completion.task.reward,
                        internal_type=TransactionType.DEPOSIT,
                        type_of_deposit=DepositType.TASK,
                        status=TransactionStatus.SUCCESSFUL,
                    )
                    if main_user.referral_user is not None:
                        referral_reward = completion.task.reward * (0.05 * main_user.referral_user.referral_level)
                        main_user.referral_user.balance += referral_reward
                        referral_transaction = await Transaction.objects.acreate(
                            user=main_user.referral_user,
                            sum_of_transaction=referral_reward,
                            internal_type=TransactionType.DEPOSIT,
                            type_of_deposit=DepositType.REFERRAL,
                            status=TransactionStatus.SUCCESSFUL,
                        )
                        main_user.referral_user.referral_earnings += referral_reward
                        await main_user.referral_user.asave()
                        await referral_transaction.asave()

                    await transaction.asave()
                    await main_user.asave()

                    completion.status = Status.ACCEPTED
                    await completion.asave()

                    async for user in await sync_to_async(User.objects.filter)(id__in=validators_to_reward):
                        user.balance += completion.task.validation_reward
                        transaction = await Transaction.objects.acreate(
                            user=user,
                            sum_of_transaction=completion.task.validation_reward,
                            internal_type=TransactionType.DEPOSIT,
                            type_of_deposit=DepositType.VALIDATION,
                            status=TransactionStatus.SUCCESSFUL,
                        )
                        await user.asave()
                        await transaction.asave()

            return completion_object
        else:
            return 400, {"detail": "Already rated"}
    except User.DoesNotExist:
        return 404, {"detail": "User does not exist"}
    except Completion.DoesNotExist:
        return 404, {"detail": "No completion found"}
    except Task.DoesNotExist:
        return 404, {"detail": "Task not found"}
    except RateRecord.DoesNotExist:
        return 404, {"detail": "No completion found"}
