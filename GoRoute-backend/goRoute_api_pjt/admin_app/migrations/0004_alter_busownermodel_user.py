# Generated by Django 5.1.4 on 2025-01-01 10:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0003_busownermodel_is_approved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='busownermodel',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bus_owner', to=settings.AUTH_USER_MODEL),
        ),
    ]
