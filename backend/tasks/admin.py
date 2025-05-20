import boto3
from asgiref.sync import async_to_sync
from botocore.exceptions import ClientError
from django.contrib import admin
from django.template.defaultfilters import truncatechars
from django.utils.safestring import mark_safe
from typing_extensions import Optional
from urllib3 import request

from accounts.models import Transaction, TransactionType, DepositType, TransactionStatus, User
from core import settings
from tasks.models import Task, Completion, MyFile, RateRecord, CompletionForValidation, Status
from django.db.models import Count, F
import random


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "internal_type", "reward", "validation_reward", "time_to_complete",
                    "limit_completions", "task_paused", "validation_paused",
                    "validation_limit", "get_task_status", "get_completion_counter"]
    list_filter = ["internal_type"]
    actions = ["pause_task", "continue_task", "pause_validation", "continue_validation"]

    class Media:
        js = ('js/task_admin.js',)

    @admin.display(description='Status')
    def get_task_status(self, obj: Task) -> str:
        # "In Progress" "Completed" "Validating"
        status = async_to_sync(obj.get_status)()
        return status

    @admin.display(description='Completion Counter')
    def get_completion_counter(self, obj: Task) -> int:
        count_completions = async_to_sync(obj.count_completions)()
        return count_completions

    def _process(self, request, task: Task, task_or_validation: str, paused: bool):
        if task_or_validation == "task":
            task.task_paused = paused
        if task_or_validation == "validation":
            task.validation_paused = paused
        task.save()

    @admin.action(description="Pause Task")
    def pause_task(self, request, queryset):
        for task in queryset:
            self._process(request, task, task_or_validation="task", paused=True)
        self.message_user(request, "Selected tasks have been paused.")

    @admin.action(description="Continue Task")
    def continue_task(self, request, queryset):
        for task in queryset:
            self._process(request, task, task_or_validation="task", paused=False)
        self.message_user(request, "Selected tasks have been continued.")

    @admin.action(description="Pause Validation")
    def pause_validation(self, request, queryset):
        for task in queryset:
            self._process(request, task, task_or_validation="validation", paused=True)
        self.message_user(request, "Selected task's validations have been paused.")

    @admin.action(description="Continue Validation")
    def continue_validation(self, request, queryset):
        for task in queryset:
            self._process(request, task, task_or_validation="validation", paused=False)
        self.message_user(request, "Selected task's validations have been continued.")


@admin.register(MyFile)
class MyFileAdmin(admin.ModelAdmin):
    readonly_fields = ["id", "original_file_name", "url", "file_uuid", "file_type", "upload_finished_at"]
    list_display = ["id", "file_uuid", "get_file_url", "file_type", "upload_finished_at"]

    @admin.display(description='File')
    def get_file_url(self, obj: MyFile) -> str:
        return mark_safe(f'<a href="{obj.url}">{truncatechars(obj.original_file_name, 30)}</a>')


class RateRecordAdmin(admin.TabularInline):
    model = RateRecord
    list_display = ["id", "completion", "score", "validator"]


@admin.register(Completion)
class CompletionAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "task", "get_file_url", "completion_date_and_time", "status", "score",
                    "sent_for_manual_validation"]
    inlines = [RateRecordAdmin]

    @admin.display(description='File URL')
    def get_file_url(self, obj: Completion) -> str:
        try:
            return mark_safe(f'<a href="{obj.file.url}">{truncatechars(obj.file.original_file_name, 30)}</a>')
        except Exception as e:
            return "Not Found"


@admin.register(CompletionForValidation)
class CompletionForValidationAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "task", "get_file_url", "status", "score", "validation_status", ]
    actions = ["accept_completion", "decline_completion"]

    @admin.display(description='File URL')
    def get_file_url(self, obj: Completion) -> str:
        try:
            return mark_safe(f'<a href="{obj.file.url}">{truncatechars(obj.file.original_file_name, 30)}</a>')
        except Exception as e:
            return "Not Found"

    def has_add_permission(self, request, obj=None):
        return False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.filter(status=Status.IN_REVIEW, sent_for_manual_validation=True)
        return queryset

    def validation_status(self, obj):
        return f"{obj.completion_rate.count()}/{obj.task.validation_limit}"

    validation_status.short_description = "Validation Status"

    @admin.action(description="Accept selected completions")
    def accept_completion(self, request, queryset):
        for completion in queryset:
            self._process_completion(request, completion, accepted=True)
        self.message_user(request, "Selected completions have been accepted.")

    @admin.action(description="Decline selected completions")
    def decline_completion(self, request, queryset):
        for completion in queryset:
            self._process_completion(request, completion, accepted=False)
        self.message_user(request, "Selected completions have been declined.")

    def _process_completion(self, request, completion, accepted):
        rate_records = completion.completion_rate.all()

        destination_folder = "Accepted" if accepted else "Declined"
        try:
            self._move_file(completion.file, destination_folder)
        except Exception as e:
            self.message_user(
                request=request,
                message=f"Failed to move file {completion.file.file_uuid}: {e}",
                level="error"
            )

        if accepted:
            completion.status = Status.ACCEPTED
            completion.save()
            validators_to_reward = rate_records.filter(score__gte=3).values_list("validator", flat=True)
            self._reward_users(completion=completion, user_ids=validators_to_reward, main_user=completion.user.wallet_address)
        else:
            completion.status = Status.DECLINED
            completion.save()
            validators_to_reward = rate_records.filter(score__lte=2).values_list("validator", flat=True)
            self._reward_users(completion=completion, user_ids=validators_to_reward)

    def transaction_creation_and_adding(self, user, sum_to_add, transaction_type, from_user=None):
        user.balance += sum_to_add
        transaction = Transaction.objects.create(
            user=user,
            sum_of_transaction=sum_to_add,
            internal_type=TransactionType.DEPOSIT,
            type_of_deposit=transaction_type,
            status=TransactionStatus.SUCCESSFUL,
            from_user=from_user
        )
        if transaction_type == DepositType.REFERRAL:
            user.referral_earnings += sum_to_add
        user.save()
        transaction.save()

    def _reward_users(self, completion, user_ids, main_user: Optional[str] = None):
        if main_user:
            main_user = User.objects.get(wallet_address=main_user)
            task_reward = completion.task.reward
            calculated_reward_with_bonus = main_user.calculate_bonus(task_reward)
            self.transaction_creation_and_adding(main_user, calculated_reward_with_bonus, DepositType.TASK)
            if main_user.referral_user is not None:
                referral_reward = calculated_reward_with_bonus * (0.05 * main_user.referral_user.referral_level)
                self.transaction_creation_and_adding(main_user.referral_user, referral_reward, DepositType.REFERRAL,
                                                     from_user=main_user.wallet_address)

        for user in User.objects.filter(wallet_address__in=user_ids):
            self.transaction_creation_and_adding(user, completion.task.validation_reward, DepositType.VALIDATION)
            if user.referral_user is not None:
                referral_reward = completion.task.validation_reward * (0.05 * user.referral_user.referral_level)
                self.transaction_creation_and_adding(user.referral_user, referral_reward, DepositType.REFERRAL,
                                                     from_user=user.wallet_address)

    def _move_file(self, file_obj, destination_folder):
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        try:
            completion: Completion = Completion.objects.get(file=file_obj)
        except Completion.DoesNotExist as e:
            raise Exception(f"Failed to move file in S3: {e}")

        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        source_key = f"Tasks/{completion.task.id}/{file_obj.file_uuid}{file_obj.file_type}"
        destination_key = f"Tasks/{completion.task.id}/{destination_folder}/{file_obj.file_uuid}{file_obj.file_type}"
        try:
            s3_client.copy_object(
                Bucket=bucket_name,
                CopySource={"Bucket": bucket_name, "Key": source_key},
                Key=destination_key
            )
            s3_client.delete_object(Bucket=bucket_name, Key=source_key)
        except ClientError as e:
            raise Exception(f"Failed to move file in S3: {e}")
