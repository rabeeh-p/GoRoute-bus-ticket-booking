# Generated by Django 5.1.4 on 2025-01-01 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0002_busownermodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='busownermodel',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
