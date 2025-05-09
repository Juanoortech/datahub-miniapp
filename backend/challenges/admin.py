from django.contrib import admin

from challenges.models import Challenge, ChallengeCompletion


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ["title", "reward", "internal_type", "completion_limit"]


@admin.register(ChallengeCompletion)
class ChallengeCompletionAdmin(admin.ModelAdmin):
    list_display = ["user", "challenge", "claimed", "can_be_claimed_in"]
