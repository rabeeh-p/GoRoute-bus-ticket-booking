# Generated by Django 5.1.4 on 2025-01-10 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0021_busmodel_scheduled'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduledBus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bus_number', models.CharField(max_length=20)),
                ('bus_owner_name', models.CharField(max_length=100)),
                ('bus_type', models.CharField(max_length=100)),
                ('seat_type', models.CharField(max_length=50)),
                ('seat_count', models.IntegerField()),
                ('route', models.CharField(max_length=255)),
                ('scheduled_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('active', 'Active'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='active', max_length=50)),
                ('description', models.TextField(blank=True, null=True)),
                ('started', models.BooleanField(default=False)),
            ],
        ),
    ]
