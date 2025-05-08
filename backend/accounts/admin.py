from django.contrib import admin

from accounts.models import User, Transaction, Bonus, BonusRule


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class TgUserAdmin(admin.ModelAdmin):
    search_fields = ("name", "id", "referral_user__name", "referral_code")
    list_display = ["id", "tg_username", "name", "balance", "is_premium", "language_code", "referral_code",
                    "referral_user", "referral_level", "referral_earnings"]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + (
                "id",
                "referral_code",
            )
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


class BonusAdmin(admin.TabularInline):
    model = Bonus
    list_display = ["user", "created_at"]


@admin.register(BonusRule)
class BonusRuleAdmin(admin.ModelAdmin):
    list_display = ("rank", "bonus_percentage")
    search_fields = ("rank",)
    list_editable = ("bonus_percentage",)
    ordering = ("rank",)
    fieldsets = (
        (None, {
            "fields": ("rank", "bonus_percentage"),
        }),
    )
    inlines = [BonusAdmin]
