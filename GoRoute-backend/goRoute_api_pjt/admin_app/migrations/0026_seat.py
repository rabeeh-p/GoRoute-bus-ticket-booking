# Generated by Django 5.1.4 on 2025-01-13 05:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0025_scheduledstop_distance_km'),
    ]

    operations = [
        migrations.CreateModel(
            name='Seat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seat_number', models.PositiveIntegerField()),
                ('status', models.CharField(choices=[('available', 'Available'), ('booked', 'Booked')], default='available', max_length=20)),
                ('bus', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='seats', to='admin_app.scheduledbus')),
            ],
            options={
                'unique_together': {('bus', 'seat_number')},
            },
        ),
    ]
