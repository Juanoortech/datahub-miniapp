from django.contrib import admin

from challenges.models import Challenge, TgChannel, ChallengeCompletion


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ["title", "reward", "internal_type", "completion_limit"]


@admin.register(ChallengeCompletion)
class ChallengeCompletionAdmin(admin.ModelAdmin):
    list_display = ["user", "challenge", "claimed", "can_be_claimed_in"]


@admin.register(TgChannel)
class TgChannelAdmin(admin.ModelAdmin):
    pass
