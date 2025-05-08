import logging
import os
import datetime
import enum
import uuid
from random import choices
from wsgiref.validate import validator

from django.db import models
from django.db.models import TextChoices, Count, Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from accounts.models import User
from core import settings
from django.core.exceptions import ValidationError


class TaskTypes(TextChoices):
    AUDIO = "Audio"
    VIDEO = "Video"
    PHOTO = "Photo"


class Status(TextChoices):
    HOLD = "Hold"
    IN_REVIEW = "In Review"
    ACCEPTED = "Accepted"
    DECLINED = "Declined"


class MyFile(models.Model):
    original_file_name = models.TextField(verbose_name="Original File Name")
    file_uuid = models.UUIDField(
        default=uuid.uuid4, unique=True, verbose_name="File UUID"
    )
    file_type = models.CharField(max_length=255, verbose_name="File Type")
    upload_finished_at = models.DateTimeField(blank=True, null=True, default=None,
                                              verbose_name="File upload finished at")

    url = models.URLField(
        verbose_name="File URL",
        blank=True,
        null=True,
        editable=False
    )

    @property
    def is_valid(self):
        return bool(self.upload_finished_at)

    def __str__(self):
        return self.original_file_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        completion: Completion = Completion.objects.filter(file=self).first()
        if completion:
            self.url = f"{settings.AWS_STATIC_URL}Tasks/{completion.task.id}/{self.file_uuid}{self.file_type}"
            if completion:
                if completion.status == Status.ACCEPTED:
                    self.url = f"{settings.AWS_STATIC_URL}Tasks/{completion.task.id}/Accepted/{self.file_uuid}{self.file_type}"
                elif completion.status == Status.DECLINED:
                    self.url = f"{settings.AWS_STATIC_URL}Tasks/{completion.task.id}/Declined/{self.file_uuid}{self.file_type}"


def validate_example_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".mp3", ".png", ".jpg", ".jpeg", ".mp4"]
    if not ext.lower() in valid_extensions:
        raise ValidationError(
            "Unsupported file extension. Use only mp3, png, jpg, jpeg or mp4"
        )


def validate_pdf_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".pdf", ]
    if not ext.lower() in valid_extensions:
        raise ValidationError(
            "Unsupported file extension. Use only pdf"
        )


def validate_photo_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".png", ".jpg", ".jpeg"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension. Use only png, jpg or jpeg")


def exempt_zero(value):
    if value <= 0:
        raise ValidationError(
            "Please enter a value greater than 0",
            params={'value': value},
        )


class Task(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    internal_type = models.CharField(choices=TaskTypes.choices, verbose_name="Type")
    photo = models.ImageField(
        upload_to="Other/tasks-photos/",
        verbose_name="Photo",
        validators=[validate_photo_file_extension],
    )
    task_instruction = models.FileField(
        upload_to="Other/tasks-instructions/",
        verbose_name="Task instruction",
        validators=[validate_pdf_file_extension],
        default=None,
        null=True,
        blank=True,
    )
    reward = models.PositiveIntegerField(verbose_name="Reward", validators=[exempt_zero])
    validation_reward = models.PositiveIntegerField(verbose_name="Validation Reward", validators=[exempt_zero])
    description = models.TextField(blank=False, null=False, verbose_name="Project description")
    text = models.TextField(blank=False, null=False, verbose_name="Task description")
    audio_text = models.TextField(
        blank=True, null=True, default=None, verbose_name="Audio Text"
    )
    example = models.FileField(
        verbose_name="Example File",
        default=None,
        null=True,
        blank=True,
        upload_to="Other/file-examples/",
        validators=[validate_example_file_extension],
    )
    time_to_complete = models.DurationField(
        default=datetime.timedelta(minutes=5), verbose_name="Time To Complete"
    )
    limit_completions = models.IntegerField(
        default=100, verbose_name="Limit Of Completions"
    )
    limit_file_size = models.IntegerField(default=0, verbose_name="Limit File Size", help_text="In MB")
    limit_video_length = models.DurationField(
        default=datetime.timedelta(minutes=5), verbose_name="Limit Video Length"
    )
    limit_audio_length = models.DurationField(
        default=datetime.timedelta(minutes=5), verbose_name="Limit Audio Length"
    )
    validation_percent = models.FloatField(
        default=0, verbose_name="Validation %"
    )
    validation_limit = models.IntegerField(default=3, verbose_name="Validation Limit",
                                           help_text="Validation Limit for one completion")
    when_was_sent_to_validation = models.DateTimeField(
        blank=True, null=True, default=None, verbose_name="When was sent to validation"
    )
    start_time = models.DateTimeField(blank=True, null=True, default=None, verbose_name="Start Time",
                                      help_text="Start time to postpone starting")

    task_paused = models.BooleanField(default=False, verbose_name="Task Paused?")
    validation_paused = models.BooleanField(default=False, verbose_name="Validation Paused?")

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.title

    async def get_validation_pool_without_current_user(self, user: User):
        completions_pool = []

        async for i in Completion.objects.select_related("user", "task", "file").filter(task=self).exclude(user=user):
            if not await RateRecord.objects.select_related("validator", "completion").filter(validator=user,
                                                                                             completion=i).aexists():
                completions_pool.append(i)

        return completions_pool

    async def is_suitable_to_be_validated(self, user: User):
        flag = await Task.objects.filter(id=self.id).prefetch_related(
            "completion__completion_rate").select_related("completion__completion_rate_validator").filter(
            completion__completion_rate__validator=user).aexists()

        if flag:
            return False
        return True

    async def count_completions(self):
        counter = await Completion.objects.filter(task=self).acount()
        return counter

    async def get_status(self):
        status = "In Progress"
        completions = Completion.objects.select_related("user", "task", "file").filter(task=self)
        if await completions.filter(Q(status=Status.IN_REVIEW)).aexists():
            status = "Validating"
        elif await completions.filter(
                ~Q(status=Status.IN_REVIEW) & (Q(status=Status.ACCEPTED) | Q(status=Status.DECLINED))).aexists():
            status = "Completed"

        if self.task_paused or self.validation_paused:
            status = "On hold"
            
        return status


class Completion(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, verbose_name="Task")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    file = models.OneToOneField(
        MyFile,
        on_delete=models.CASCADE,
        verbose_name="File",
        null=True,
        blank=True,
        default=None,
    )
    completion_date_and_time = models.DateTimeField(
        null=True, verbose_name="Completion Date", auto_now_add=True
    )
    status = models.CharField(choices=Status.choices, verbose_name="Status")
    score = models.FloatField(default=0, verbose_name="Score")

    sent_for_manual_validation = models.BooleanField(
        default=False, verbose_name="Sent for manual validation"
    )
    when_sent_for_validation = models.DateTimeField(
        blank=True, null=True, verbose_name="When sent for validation", default=None
    )

    class Meta:
        verbose_name = "Completion"
        verbose_name_plural = "Completions"

    def __str__(self):
        return f"{self.user.name}| {self.task.title}"


class RateRecord(models.Model):
    score = models.SmallIntegerField(default=0, verbose_name="Score")
    completion = models.ForeignKey(
        Completion,
        on_delete=models.CASCADE,
        verbose_name="Completion",
        related_name="completion_rate",
    )
    validator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Validator",
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name="Created at")

    def __str__(self):
        return f"{self.validator.name} {self.completion.task.title}"


class CompletionForValidation(Completion):
    class Meta:
        proxy = True
        verbose_name = "Completion For Admin Validation"
        verbose_name_plural = "Completions For Admin Validation"
