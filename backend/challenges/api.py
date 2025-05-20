import json
from datetime import datetime, timezone
from django.utils import timezone
from asgiref.sync import sync_to_async
from django.utils.timezone import make_aware
from ninja import Router, Query
from typing import List
from django.core.handlers.asgi import ASGIRequest
from django.core.handlers.wsgi import WSGIRequest

from ninja.pagination import paginate

from accounts.models import User, Transaction, TransactionType, DepositType, TransactionStatus
from accounts.pagination import MyPaginator
from challenges.models import Challenge, ChallengeCompletion, ChallengeTypes
from challenges.schemes import DetailOut, ChallengeFilterSchema, \
    ChallengeListSchema, ChallengeSchema, ChallengeCompletionSchema, CompletionSendOut

router = Router()

# All endpoints now use global authentication


@router.get(
    "/",
    response={200: List[ChallengeListSchema]}
)
@paginate(MyPaginator)
async def challenges_list(request: WSGIRequest | ASGIRequest, filters: Query[ChallengeFilterSchema]):
    response = []
    parse_comma_list = lambda x: [v for v in (v.strip() for v in x.split(",")) if v]
    parsed_status = parse_comma_list(filters.status) if filters.status else None
    async for i in Challenge.objects.filter(filters.get_filter_expression()):
        challenge_status = await i.get_user_challenge_status(user=request.auth)
        data = {
            "challenge": i,
            "status": challenge_status,
        }
        if parsed_status:
            if challenge_status in parsed_status:
                response.append(data)
        else:
            response.append(data)
    return response


async def add_reward(user: User, challenge: Challenge, completion_ch_object: ChallengeCompletion):
    new_transaction: Transaction = await Transaction.objects.acreate(
        user=user,
        sum_of_transaction=challenge.reward,
        internal_type=TransactionType.DEPOSIT,
        type_of_deposit=DepositType.CHALLENGE,
        status=TransactionStatus.SUCCESSFUL,
    )
    user.balance += challenge.reward
    completion_ch_object.claimed = True
    referral: User = (await User.objects.filter(wallet_address=user.wallet_address).select_related("referral_user").afirst()).referral_user
    if referral is not None:
        referral_reward = challenge.reward * (0.05 * referral.referral_level)
        referral_reward_transaction: Transaction = await Transaction.objects.acreate(
            user=referral,
            sum_of_transaction=referral_reward,
            internal_type=TransactionType.DEPOSIT,
            type_of_deposit=DepositType.REFERRAL,
            status=TransactionStatus.SUCCESSFUL,
            from_user=user
        )
        referral.referral_earnings += referral_reward
        referral.balance += referral_reward
        await referral.asave()
        await referral_reward_transaction.asave()
    await user.asave()
    await new_transaction.asave()
    await completion_ch_object.asave()


@router.post(
    "/{challenge_id}/",
    response={200: CompletionSendOut, 400: DetailOut}
)
async def challenges_complete(request: WSGIRequest | ASGIRequest, challenge_id: int):
    user: User = await User.objects.aget(wallet_address=request.auth)

    challenge: Challenge = await Challenge.objects.filter(id=challenge_id).afirst()
    if not challenge:
        return 400, {"detail": "Task not found"}
    if await ChallengeCompletion.objects.filter(challenge=challenge,
                                                claimed=True).acount() > challenge.completion_limit:
        return 400, {"detail": "Completion limit reached"}

    completion_ch_object: ChallengeCompletion = await ChallengeCompletion.objects.filter(
        user=user,
        challenge=challenge
    ).afirst()

    created = False
    if not completion_ch_object:
        new_completion_ch_info = {
            "challenge": challenge,
            "user": user,
            "claimed": False,
        }
        if challenge.imitation_timer is not None:
            new_completion_ch_info["can_be_claimed_in"] = timezone.now() + challenge.imitation_timer

        completion_ch_object: ChallengeCompletion = await ChallengeCompletion.objects.acreate(
            **new_completion_ch_info,
        )
        created = True

    if completion_ch_object.claimed:
        return 400, {"detail": "Already Claimed"}
    else:
        if challenge.internal_type == ChallengeTypes.REAL:
            if challenge.channel is None:
                return 400, {"detail": "Channel not specified"}
            # TODO: По-хорошему сделать асинхронным
            return 200, {
                "created": created,
                "claim_prize": "not claimed",
            }
        elif challenge.internal_type == ChallengeTypes.IMITATION:
            current_tz = timezone.get_current_timezone()
            if completion_ch_object.can_be_claimed_in.astimezone(current_tz) <= timezone.now().astimezone(current_tz):
                await add_reward(user=user, challenge=challenge, completion_ch_object=completion_ch_object)
                return 200, {
                    "created": created,
                    "claim_prize": "claimed",
                }
            return 200, {
                "created": created,
                "claim_prize": "not claimed",
            }
    return 400, {"detail": "Unknown Error"}


@router.get(
    "/{challenge_id}/",
    response={200: ChallengeSchema, 404: DetailOut}
)
async def challenge_info(request: WSGIRequest | ASGIRequest, challenge_id: int):
    try:
        challenge: Challenge = await Challenge.objects.aget(id=challenge_id)
    except Challenge.DoesNotExist:
        return 404, {"detail": "Challenge not found"}
    return challenge


@router.get(
    "/completions/{challenge_id}/",
    response={200: ChallengeCompletionSchema, 404: DetailOut}
)
async def completion_by_challenge_id_info(request: WSGIRequest | ASGIRequest, challenge_id: int):
    try:
        challenge: Challenge = await Challenge.objects.aget(id=challenge_id)
        challenges_completion: ChallengeCompletion = await ChallengeCompletion.objects.select_related(
            "user",
            "challenge",
            "challenge__channel"
        ).aget(
            challenge=challenge, user=request.auth
        )
    except Challenge.DoesNotExist:
        return 404, {"detail": "Challenge not found"}
    except ChallengeCompletion.DoesNotExist:
        return 404, {"detail": "Challenge completion not found"}

    return challenges_completion
