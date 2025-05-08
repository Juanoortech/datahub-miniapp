from django.contrib import admin

from service.models import AppLinks


@admin.register(AppLinks)
class AppLinksAdmin(admin.ModelAdmin):
    pass