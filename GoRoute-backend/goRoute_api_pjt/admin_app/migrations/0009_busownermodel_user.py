# Generated by Django 5.1.4 on 2025-01-03 14:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0008_remove_busownermodel_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='busownermodel',
            name='user',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='bus_owner', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]