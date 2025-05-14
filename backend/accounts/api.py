import os
import jwt
import logging
from datetime import datetime, timedelta, timezone

from asgiref.sync import sync_to_async
from django.db.models import QuerySet
from ninja import Router, Query
from django.core.handlers.wsgi import WSGIRequest
from django.core.handlers.asgi import ASGIRequest
from ninja.pagination import paginate

from accounts.pagination import MyPaginator
from accounts.schemes import *
from core import settings

from accounts.models import User, ReferralLevels, Transaction, TransactionType, TransactionStatus, DepositType
from eth_account.messages import encode_defunct
from eth_account import Account

router = Router()


async def authenticate(request: WSGIRequest | ASGIRequest):
    token = request.headers.get("Authorization")
    if token:
        try:
            payload = jwt.decode(
                jwt=token, key=settings.SECRET_KEY, algorithms=["HS256"]
            )
            user = payload.get("user", None)
            if user:
                return user
        except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError, jwt.DecodeError):
            pass
    return


async def update_ref_level(referral_user: User):
    referrals_counter = (
            await User.objects.filter(referral_user=referral_user).acount() + 1
    )
    match referrals_counter:
        case c if 0 <= c <= 5:
            referral_user.referral_level = ReferralLevels.FIRST
        case c if 5 < c <= 20:
            referral_user.referral_level = ReferralLevels.SECOND
        case c if 20 < c:
            referral_user.referral_level = ReferralLevels.THIRD
    await referral_user.asave()


async def add_initial_bonus(inviter: User, from_user: User):
    initial_bonus = 50 * inviter.referral_level
    inviter.balance += initial_bonus
    inviter.referral_earnings += initial_bonus
    await inviter.asave()

    referral_transaction = await Transaction.objects.acreate(
        user=inviter,
        sum_of_transaction=initial_bonus,
        internal_type=TransactionType.DEPOSIT,
        type_of_deposit=DepositType.REFERRAL,
        status=TransactionStatus.SUCCESSFUL,
        from_user=from_user,
    )


@router.get(
    "/",
    auth=authenticate,
    response={200: UserOut, 401: DetailOut},
    summary="Get current authenticated user's info",
)
async def me(request: WSGIRequest | ASGIRequest):
    user: Optional[User] = None
    try:
        user = await User.objects.aget(id=request.auth)
    except User.DoesNotExist:
        return 401, {"detail": "User not found"}
    return user


@router.post(
    "/",
    response={200: UserOut},
    summary="Create a new user"
)
async def create_user(request: WSGIRequest | ASGIRequest, payload: UserInit):
    new_user: User
    new_user, created = await User.objects.select_related("referral_user").aget_or_create(wallet_address=payload.wallet_address)
    if payload.name:
        new_user.name = payload.name
    already_has_referral = new_user.referral_user
    if payload.referral_code and not already_has_referral:
        inviter: QuerySet = User.objects.filter(
            referral_code=payload.referral_code
        )
        if await inviter.aexists():
            inviter: User = await inviter.afirst()
            logging.error(inviter)
            if inviter != new_user:
                new_user.referral_user = inviter
                await new_user.asave()
                await add_initial_bonus(inviter=inviter, from_user=new_user)
                await update_ref_level(inviter)
    await new_user.asave()
    return 200, new_user


@router.post(
    "/first-login/",
    auth=authenticate,
    response={200: UserOut, 404: DetailOut},
    summary="Set the first login flag of the current user",
)
async def set_first_login(request: WSGIRequest | ASGIRequest):
    user: Optional[User] = None
    try:
        user = await User.objects.aget(id=request.auth)
        user.first_login = False
        await user.asave()
    except User.DoesNotExist:
        return 404, {"detail": "User not found"}
    return user


@router.get(
    "/transactions/",
    auth=authenticate,
    response=List[TransactionSchema],
    summary="Get current authenticated user's transactions history",
)
@paginate(MyPaginator)
async def transactions_history(request: WSGIRequest | ASGIRequest, filters: Query[TransactionFilterSchema]):
    transactions = [
        transaction
        async for transaction in
        Transaction.objects.filter(user=request.auth).filter(filters.get_filter_expression()).select_related(
            "from_user").all()
    ]
    return transactions


@router.get(
    "/referrals/",
    auth=authenticate,
    response=List[ReferralListUserOut],
    summary="Get current authenticated user's referrals",
)
@paginate(MyPaginator)
async def get_user_referrals(request: WSGIRequest | ASGIRequest):
    referrals = []
    async for referral in User.objects.filter(referral_user=request.auth).order_by(
            "id"
    ):
        ref_sum: int = await referral.get_ref_sum_from_user()
        referrals.append(
            {
                "user": referral,
                "specified_referral_earnings": ref_sum
            }
        )
    return list(referrals)


@router.get(
    "/leaderboard/",
    auth=authenticate,
    response=List[LeaderBoardUserSchema],
    summary="Get top 100 users",
)
@paginate(MyPaginator)
async def get_leaderboard_info(request: WSGIRequest | ASGIRequest):
    users = [{
        "id": user.id,
        "avatar": user.photo,
        "name": user.name,
        "points": user.balance,
    } async for user in User.objects.order_by("-balance", "id")][:100]

    return users


@router.get(
    "/leaderboard/current/",
    auth=authenticate,
    response={200: LeaderBoardUserInfoSchema, 401: DetailOut},
    summary="Get user's leaderboard info",
)
async def get_user_leaderboard_info(request: WSGIRequest | ASGIRequest):
    response = {}
    try:
        user: User = await User.objects.aget(id=request.auth)
        rank: int = await user.get_rank()
        if rank <= 5:
            current_bonus = await sync_to_async(user.get_current_bonus)()
            if current_bonus:
                current_bonus = round(float(current_bonus) / 100, 2) + 1
            response["viewer_bonus"] = current_bonus
        response["viewer_points"] = user.balance
        response["viewer_place"] = rank
    except User.DoesNotExist:
        return 401, {"detail": "User does not exist"}

    return 200, response


@router.post(
    "/wallets/",
    response={404: DetailOut, 200: ConnectWalletSchemaOut},
    summary="Connect wallet to user using code",
)
async def connect_wallet_to_user(request: WSGIRequest | ASGIRequest, data: ConnectWalletSchemaIn):
    try:
        user: User = await User.objects.aget(wallet_connect_code=data.wallet_connect_code)
        user.wallet_was_connected = True
        await user.asave()
        return 200, {
            "user_id": user.id,
            "balance": user.balance,
        }
    except User.DoesNotExist:
        return 404, {"detail": "User not found"}


@router.post(
    "/wallets/withdraw/",
    response={200: List[WithdrawWalletSchemaOut], 404: DetailOut},
    summary="Withdraw points using TG ID",
)
async def withdraw_points(request: WSGIRequest | ASGIRequest, data: WithdrawSchema):
    successful_withdraws = []
    for user_id in data.user_ids:
        try:
            user: User = await User.objects.aget(id=user_id)
            transaction = await Transaction.objects.acreate(
                user=user,
                sum_of_transaction=user.balance,
                internal_type=TransactionType.WITHDRAW,
                type_of_deposit=None,
                status=TransactionStatus.WIP,
            )
            if user.wallet_was_connected:
                old_balance = user.balance
                transaction.status = TransactionStatus.SUCCESSFUL
                user.balance = 0
                await user.asave()
                await transaction.asave()
                successful_withdraws.append({"user_id": user_id, "balance": old_balance})
            else:
                transaction.status = TransactionStatus.DECLINED
                await transaction.asave()
                return 404, {"detail": "User was found, but wallet was not connected"}
        except User.DoesNotExist:
            return 404, {"detail": "User not found"}

    return 200, successful_withdraws


@router.post(
    "/auth/web3/",
    summary="Authenticate user via Web3 signature",
)
async def authenticate_web3(request: WSGIRequest | ASGIRequest, data: SignatureVerifyIn):
    # Verify the signature using eth-account
    message = encode_defunct(text=data.message)
    recovered_address = Account.recover_message(message, signature=data.signature)
    if recovered_address.lower() != data.wallet_address.lower():
        return 400, {"detail": "Invalid signature"}
    # Issue JWT or session token here
    # ...
    return 200, {"wallet_address": data.wallet_address}
