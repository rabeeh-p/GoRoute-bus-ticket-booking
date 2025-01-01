from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


# Role choices
ROLE_CHOICES = (
    ('super_admin', 'Super Admin'),
    ('bus_owner', 'Bus Owner'),
    ('normal_user', 'Normal User'),
)

class CustomUser(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='normal_user')

    def __str__(self):
        return self.username