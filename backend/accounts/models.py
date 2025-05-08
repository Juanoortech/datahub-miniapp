import datetime
import logging
import uuid
from typing import Optional

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import SET_NULL, Choices, Sum
from django.db.models.signals import post_save
from django.dispatch import receiver


class ReferralLevels(models.IntegerChoices):
    FIRST = 1, "1 Level"
    SECOND = 2, "2 Level"
    THIRD = 3, "3 Level"


class TransactionType(models.TextChoices):
    DEPOSIT = "Deposit"
    WITHDRAW = "Withdraw"


class TransactionStatus(models.TextChoices):
    SUCCESSFUL = "Successful"
    WIP = "Work In Progress"
    DECLINED = "Declined"


class DepositType(models.TextChoices):
    CHALLENGE = "Challenge"
    TASK = "Task"
    VALIDATION = "Validation"
    REFERRAL = "Referral"


class User(models.Model):
    id = models.BigIntegerField(primary_key=True, unique=True, verbose_name="TG ID")
    tg_username = models.CharField(verbose_name="TG Username", max_length=255, blank=True, null=True, default=None)
    name = models.CharField(verbose_name="Name")
    photo = models.CharField(null=True, blank=True, verbose_name="Photo", default=None)
    balance = models.BigIntegerField(default=0, verbose_name="Balance")
    is_premium = models.BooleanField(default=False)
    language_code = models.CharField(default="en")
    referral_code = models.UUIDField(
        default=uuid.uuid4, unique=True, verbose_name="Referral Code"
    )
    wallet_connect_code = models.UUIDField(
        default=uuid.uuid4, unique=True, verbose_name="Wallet connect code"
    )
    wallet_was_connected = models.BooleanField(default=False)
    referral_user = models.ForeignKey(
        to="self",
        on_delete=SET_NULL,
        null=True,
        blank=True,
        default=None,
        verbose_name="Referral",
        related_name="referral_user_connected",
    )
    referral_level = models.SmallIntegerField(
        choices=ReferralLevels.choices,
        default=ReferralLevels.FIRST,
        verbose_name="Level",
    )
    referral_earnings = models.BigIntegerField(
        default=0, verbose_name="Referral Earnings"
    )
    first_login = models.BooleanField(default=True, verbose_name="First Login",
                                      help_text="First Login flag to show the guide or not")

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "TG User"
        verbose_name_plural = "TG Users"

    async def get_rank(self) -> int:
        rank = await User.objects.filter(
            models.Q(balance__gt=self.balance) |
            models.Q(balance=self.balance, id__lt=self.id)
        ).acount()
        return rank + 1

    async def get_ref_sum_from_user(self) -> int:
        final_sum = await Transaction.objects.filter(
            from_user=self,
            type_of_deposit=DepositType.REFERRAL).select_related(
            "user",
            "from_user"
        ).aaggregate(
            total=Sum("sum_of_transaction")
        )
        logging.error(final_sum["total"])
        return final_sum["total"] or 0

    def get_current_bonus(self) -> Optional[float]:
        try:
            bonus = Bonus.objects.select_related("bonus_rule").get(user=self)
        except Bonus.DoesNotExist:
            return None
        return round(bonus.bonus_rule.bonus_percentage, 2)

    def calculate_bonus(self, transaction_sum):
        current_bonus: Optional[float] = self.get_current_bonus()
        new_transaction_sum = transaction_sum
        if current_bonus:
            new_transaction_sum += transaction_sum * (current_bonus / 100)
        return new_transaction_sum


class Transaction(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, verbose_name="User")
    sum_of_transaction = models.BigIntegerField(
        default=0, verbose_name="Sum of Transaction"
    )
    internal_type = models.CharField(
        choices=TransactionType.choices, verbose_name="Type"
    )
    type_of_deposit = models.CharField(
        choices=DepositType.choices, verbose_name="Deposit Type", null=True, blank=True
    )
    from_user = models.ForeignKey(to=User, on_delete=models.CASCADE,
                                  verbose_name="From which user, if type is REFERRAL", null=True, blank=True,
                                  default=None, related_name="from_user")
    status = models.CharField(choices=TransactionStatus.choices, verbose_name="Status")
    date_and_time = models.DateTimeField(
        verbose_name="Date and Time", auto_now_add=True
    )

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self) -> str:
        return f"{self.user.name} | {self.sum_of_transaction}"

    def clean(self):
        super().clean()
        if self.internal_type == TransactionType.DEPOSIT and not self.type_of_deposit:
            raise ValidationError({
                'type_of_deposit': "This field is required when the transaction type is 'Deposit'."
            })

        if self.type_of_deposit == DepositType.REFERRAL and not self.from_user:
            raise ValidationError({
                'from_user': "This field is required when the deposit type is 'Referral'."
            })


class BonusRule(models.Model):
    rank = models.PositiveIntegerField(
        verbose_name="Rank",
        help_text="Rank for which the bonus applies (e.g., 1 for first place)",
        primary_key=True
    )
    bonus_percentage = models.FloatField(
        verbose_name="Bonus Percentage",
        help_text="Percentage of the user's balance to be given as a bonus"
    )

    class Meta:
        verbose_name = "Bonus Rule"
        verbose_name_plural = "Bonus Rules"
        ordering = ["rank"]

    def __str__(self):
        return f"Rank {self.rank}: {self.bonus_percentage}%"


class Bonus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             verbose_name="User")  # Не OneToOne потому что при присваивании нужно менять местами
    bonus_rule = models.OneToOneField(BonusRule, on_delete=models.CASCADE, verbose_name="Bonus Rule")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        verbose_name = "Bonus"
        verbose_name_plural = "Bonuses"

    def __str__(self):
        return f"Bonus for {self.user.name}: {self.bonus_rule.bonus_percentage}%"


@receiver(post_save, sender=User)
async def update_bonus_for_top_users(sender, instance, **kwargs):
    try:
        current_rank = await instance.get_rank()
        bonus_rule = await BonusRule.objects.filter(rank=current_rank).afirst()
        if bonus_rule:
            bonus: Bonus = await Bonus.objects.select_related("user").filter(bonus_rule=bonus_rule).afirst()
            if not bonus:
                bonus: Bonus = await Bonus.objects.acreate(user=instance, bonus_rule=bonus_rule)
            else:
                instance_bonus = await Bonus.objects.select_related("user").filter(user=instance).afirst()
                old_bonus_user = bonus.user
                if instance_bonus:
                    instance_bonus.user = old_bonus_user
                    await instance_bonus.asave()

                bonus.user = instance
                await bonus.asave()
            logging.error(f"Bonus ({bonus_rule.bonus_percentage}%) applied for {instance.name} (Rank {current_rank}).")
        else:
            if await Bonus.objects.filter(user=instance).aexists():
                await Bonus.objects.filter(user=instance).adelete()
                logging.error(f"Bonus removed for {instance.name}, no rule for Rank: {current_rank}.")
    except Exception as e:
        logging.error(f"Error while updating bonus for {instance.name}: {e}")
