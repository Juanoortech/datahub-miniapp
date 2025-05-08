from datetime import timedelta, datetime
from typing import Optional

from django.db.models import Q
from ninja import Schema, FilterSchema, Field
from typing import TypeVar, Annotated
from pydantic import BeforeValidator

from accounts.schemes import UserOut

T = TypeVar("T")

# Splits comma-separated string into a list of items.
# Strips whitespaces and trims leading/trailing commas
# This annotation can be reused many times for different enums or plain strings
CommaList = Annotated[
    list[T],
    BeforeValidator(lambda x: [v for v in (v.strip() for v in x.split(",")) if v]),
]


class ChannelSchema(Schema):
    uri: str


class ChallengeSchema(Schema):
    id: int
    avatar: Optional[str] = None
    title: str
    reward: int
    internal_type: str
    button_text: str
    imitation_timer: Optional[timedelta] = None
    target_user_language: Optional[str] = None
    target_user_status: Optional[bool] = None
    completion_limit: int
    channel: Optional[ChannelSchema]
    redirect_link: Optional[str] = None


class ChallengeListSchema(Schema):
    challenge: ChallengeSchema
    status: str


class ChallengeCompletionSchema(Schema):
    user: UserOut
    challenge: ChallengeSchema
    claimed: bool
    can_be_claimed_in: Optional[datetime] = None


class ChallengeFilterSchema(FilterSchema):
    internal_type: CommaList[str] | None = Field(None, q="internal_type__in")
    target_user_language: Optional[str] = None
    target_user_status: Optional[bool] = None
    status: Optional[str] = None

    def custom_expression(self) -> Q:
        q = Q()
        if self.internal_type:
            q &= Q(internal_type__in=self.internal_type)
        if self.target_user_language:
            q &= Q(target_user_language=self.target_user_language)
        if self.target_user_status:
            q &= Q(target_user_status=self.target_user_status)
        if self.status:
            pass
        return q


class DetailOut(Schema):
    detail: str


class CompletionSendOut(Schema):
    created: Optional[bool] = None
    claim_prize: Optional[str] = None
