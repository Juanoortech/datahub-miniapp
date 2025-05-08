import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Any, Dict

from django.db.models import Q
from ninja import Schema, Field, FilterSchema

from accounts.schemes import UserOut
from typing import TypeVar, Annotated
from pydantic import BeforeValidator
from ninja import FilterSchema

from tasks.models import Task, Completion

T = TypeVar("T")

# Splits comma-separated string into a list of items.
# Strips whitespaces and trims leading/trailing commas
# This annotation can be reused many times for different enums or plain strings
CommaList = Annotated[
    list[T],
    BeforeValidator(lambda x: [v for v in (v.strip() for v in x.split(",")) if v]),
]


class FileIn(Schema):
    file_name: str
    file_type: str
    completion_id: int


class FileOutAWS(Schema):
    presigned_url: str
    url: str = Field(examples=["https://test-oort-assets.s3.amazonaws.com/test"])
    file_uuid: uuid.UUID = Field(examples=[str(uuid.uuid4())])


class TaskFilterSchema(FilterSchema):
    internal_type: CommaList[str] | None = Field(None, q="internal_type__in")


class TaskOut(Schema):
    id: int
    title: str
    internal_type: str
    photo: str
    task_instruction: Optional[str] = None
    reward: int
    description: str
    text: str
    audio_text: Optional[str] = None
    example: Optional[str] = None
    time_to_complete: timedelta
    limit_completions: int
    limit_file_size: int
    limit_video_length: timedelta
    limit_audio_length: timedelta
    validation_percent: float
    when_was_sent_to_validation: Optional[datetime] = None


class ValidationListTaskOut(Schema):
    task: TaskOut
    available: int


class FileOut(Schema):
    original_file_name: str
    file_uuid: uuid.UUID
    file_type: str
    upload_finished_at: Optional[datetime] = None
    url: Optional[str] = None


class CompletionFilterSchema(FilterSchema):
    status: CommaList[str] | None = Field(None, q="status__in")
    task_type: Optional[str] = None

    def custom_expression(self) -> Q:
        q = Q()
        if self.status:
            q &= Q(status__in=self.status)
        if self.task_type:
            pass
        return q


class CompletionStartIn(Schema):
    task_id: int
    # file_uuid: uuid.UUID


class CompletionSendIn(Schema):
    file_uuid: uuid.UUID


class CompletionOut(Schema):
    id: int
    user: UserOut
    task: TaskOut
    file: Optional[FileOut] = None
    completion_date_and_time: datetime
    status: str
    score: float


class CompletionHistoryOut(Schema):
    completion: CompletionOut
    task_type: str


class CompletionValidationIn(Schema):
    score: int = Field(ge=1, le=5)


class DetailOut(Schema):
    detail: str
