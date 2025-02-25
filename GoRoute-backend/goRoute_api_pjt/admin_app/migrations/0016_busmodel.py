# Generated by Django 5.1.4 on 2025-01-08 15:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0015_bustype'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.CharField(max_length=20, unique=True)),
                ('is_active', models.BooleanField(default=False)),
                ('bus_owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buses', to='admin_app.busownermodel')),
                ('bus_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='buses', to='admin_app.bustype')),
            ],
        ),
    ]
