# Generated by Django 5.1.4 on 2025-01-31 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_app', '0057_chatroom_from_user_chatroom_to_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticket',
            name='status',
            field=models.CharField(choices=[('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'), ('completed', 'Completed')], default='issued', max_length=20),
        ),
    ]
