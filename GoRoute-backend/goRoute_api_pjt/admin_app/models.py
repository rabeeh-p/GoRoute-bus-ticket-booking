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
    


class BusOwnerModel(models.Model):  
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='bus_owner')
    travel_name = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    logo_image = models.ImageField(upload_to='bus_owner_logos/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"BusOwner: {self.user.username}"
    


class NormalUserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"