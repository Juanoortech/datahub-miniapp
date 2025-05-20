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
    wallet_address: str
    name: Optional[str] = None
    referral_code: Optional[uuid.UUID] = None
    signature: str
    message: str


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
    id: str
    avatar: Optional[str] = None
    name: str
    points: int


class LeaderBoardUserInfoSchema(Schema):
    viewer_points: int
    viewer_place: int
    viewer_bonus: Optional[float] = None


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
    wallet_address: str
    balance: int


class WithdrawWalletSchemaOut(Schema):
    wallet_address: str
    balance: int


class WithdrawSchema(Schema):
    wallet_addresses: List[str]


class DetailOut(Schema):
    detail: str


class SignatureVerifyIn(Schema):
    wallet_address: str
    signature: str
    message: str
