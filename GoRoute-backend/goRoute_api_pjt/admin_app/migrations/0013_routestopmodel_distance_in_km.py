# Generated by Django 5.1.4 on 2025-01-08 13:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0012_routestopmodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='routestopmodel',
            name='distance_in_km',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True),
        ),
    ]
