from django.db import models


class AppLinks(models.Model):
    ios = models.CharField(verbose_name="IOS", max_length=255)
    android = models.CharField(verbose_name="Android", max_length=255)
    apk = models.CharField(verbose_name="APK", max_length=255)

    class Meta:
        verbose_name = "App Link"
        verbose_name_plural = "App Links"

    def __str__(self):
        return "IOS, ANDROID, APK - LINKS"