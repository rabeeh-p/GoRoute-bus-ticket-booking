# Generated by Django 5.1.4 on 2025-01-13 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0029_order_email_order_phone_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
