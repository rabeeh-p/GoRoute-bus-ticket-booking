# Generated by Django 5.1.4 on 2025-01-17 09:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0037_remove_order_selected_seats'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='selected_seats',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
