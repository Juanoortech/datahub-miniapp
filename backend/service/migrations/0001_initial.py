# Generated by Django 5.1.3 on 2025-05-14 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AppLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ios', models.CharField(max_length=255, verbose_name='IOS')),
                ('android', models.CharField(max_length=255, verbose_name='Android')),
                ('apk', models.CharField(max_length=255, verbose_name='APK')),
            ],
            options={
                'verbose_name': 'App Link',
                'verbose_name_plural': 'App Links',
            },
        ),
    ]
