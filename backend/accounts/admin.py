from django.contrib import admin

from accounts.models import User, Transaction, Bonus, BonusRule


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class Web3UserAdmin(admin.ModelAdmin):
    search_fields = ("name", "wallet_address", "referral_user__name", "referral_code")
    list_display = ["wallet_address", "name", "balance", "referral_code",
                    "referral_user", "referral_level", "referral_earnings"]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + (
                "wallet_address",
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
