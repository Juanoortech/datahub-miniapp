import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import TextChoices

from accounts.models import User


class ChallengeTypes(TextChoices):
    REAL = "Real"
    IMITATION = "Imitation"


class CompletionTypes(TextChoices):
    IN_PROGRESS = "In Progress"
    CLAIMED = "Claimed"
    NOT_CLAIMED = "Not Claimed"
    NOT_STARTED = "Not Started"


class Challenge(models.Model):
    title = models.CharField(verbose_name="Title")
    avatar = models.ImageField(
        upload_to="Other/challenge-photos/",
        verbose_name="Photo",
    )
    reward = models.IntegerField(verbose_name="Reward")
    internal_type = models.CharField(
        choices=ChallengeTypes.choices,
    )
    imitation_timer = models.DurationField(default=datetime.timedelta(minutes=30), blank=True, null=True,
                                           help_text="Should be set up if Internal type is IMITATION")
    target_user_language = models.CharField(verbose_name="User language code", null=True, blank=True,
                                            help_text="Can be empty to target all languages")
    target_user_status = models.BooleanField(verbose_name="Premium", help_text="Target only premium users",
                                             default=False, )
    button_text = models.CharField(default="Connect", verbose_name="Button text")
    completion_limit = models.IntegerField(default=100, verbose_name="Completion limit")
    redirect_link = models.URLField(verbose_name="Redirect link", blank=True, null=True, default=None,
                                    help_text="Link to redirect if task is imitation")

    class Meta:
        verbose_name = "Challenge"
        verbose_name_plural = "Challenges"

    def __str__(self) -> str:
        return f"{self.title}"

    async def get_user_challenge_status(self, user: User):
        completion: ChallengeCompletion = await ChallengeCompletion.objects.filter(user=user,
                                                                                   challenge=self).select_related(
            "challenge", "user").afirst()
        current_status = CompletionTypes.NOT_STARTED
        if completion:
            current_status = CompletionTypes.IN_PROGRESS
            if completion.challenge.internal_type == ChallengeTypes.REAL:
                current_status = CompletionTypes.NOT_CLAIMED

            if completion.claimed:
                current_status = CompletionTypes.CLAIMED

        return current_status

    def clean(self):
        super().clean()
        if self.internal_type == ChallengeTypes.IMITATION and not self.imitation_timer:
            raise ValidationError({
                'imitation_timer': "This field is required when internal type is 'Imitation'."
            })
        if self.internal_type == ChallengeTypes.IMITATION and not self.redirect_link:
            raise ValidationError({
                'redirect_link': "This field is required when internal type is 'Imitation'."
            })


class ChallengeCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, verbose_name="Challenge")
    claimed = models.BooleanField(default=False, verbose_name="Reward was claimed")
    can_be_claimed_in = models.DateTimeField(default=None, verbose_name="Can be claimed in",
                                             null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.challenge.title}"
