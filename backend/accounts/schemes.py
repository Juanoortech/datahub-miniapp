import uuid
from datetime import datetime
from typing import Optional, List, Any
from ninja import Schema, FilterSchema, Field
from typing import TypeVar, Annotated
from pydantic import BeforeValidator

T = TypeVar("T")

CommaList = Annotated[
    list[T],
    BeforeValidator(lambda x: [v for v in (v.strip() for v in x.split(",")) if v]),
]


class UserInit(Schema):
    id: int
    name: str
    username: Optional[str] = None
    is_premium: bool = False
    language_code: str = "en"
    referral_code: Optional[uuid.UUID] = None


class UserOut(Schema):
    wallet_address: str
    photo: Optional[str] = None
    name: str
    balance: int
    referral_code: uuid.UUID
    wallet_connect_code: uuid.UUID
    wallet_was_connected: Optional[bool] = False
    referral_earnings: int
    referral_level: Optional[int] = None
    first_login: Optional[bool] = True


class ReferralListUserOut(Schema):
    user: UserOut
    specified_referral_earnings: int


class LeaderBoardUserSchema(Schema):
    id: int
    avatar: Optional[str] = None
    name: str
    points: int


class LeaderBoardUserInfoSchema(Schema):
    viewer_points: int
    viewer_place: int
    viewer_bonus: Optional[float] = None


class TGUser(Schema):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    language_code: Optional[str] = None
    is_premium: Optional[bool] = None
    allows_write_to_pm: bool
    photo_url: Optional[str] = None


class UserTokenIn(Schema):
    init_data: str = Field(
        examples=[
            "query_id=AAFGtpsbAAAAAEa2mxvOzSfg&user=%7B%22id%22%3A463189574%2C%22first_name%22%3A%22yasuhiro.%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22yasuhiro_h%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1731360200&hash=2528e6d5644eaac86f0689a4dd22ceb640392e76944e4eb5dbba9a77db175e98",
        ],
        description="Should be taken from TG, usually goes with every request in mini app. Must be a safe version to parse successfully!",
    )


class UserTokenOut(Schema):
    token: str = Field(
        examples=[
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE0MjgwODUsInVzZXIiOjQ2MzE4OTU3NH0.vjI7A-Mc5wOSi9ZlZ8H9cqjbOkAYb0DFNuezfD0OFrw",
        ],
    )


class TransactionSchema(Schema):
    internal_type: str
    type_of_deposit: Optional[str] = None
    from_user: Optional[UserOut] = None
    status: str
    sum_of_transaction: int
    date_and_time: datetime


class TransactionFilterSchema(FilterSchema):
    internal_type: CommaList[str] | None = Field(None, q="internal_type__in")
    type_of_deposit: CommaList[str] | None = Field(None, q="type_of_deposit__in")
    status: CommaList[str] | None = Field(None, q="status__in")


class ConnectWalletSchemaIn(Schema):
    wallet_connect_code: uuid.UUID = Field(description="Wallet code to find and connect user from miniapp")


class ConnectWalletSchemaOut(Schema):
    user_id: int
    balance: int


class WithdrawWalletSchemaOut(Schema):
    user_id: int
    balance: int


class WithdrawSchema(Schema):
    user_ids: List[int]


class DetailOut(Schema):
    detail: str


class SignatureVerifyIn(Schema):
    wallet_address: str
    signature: str
    message: str
