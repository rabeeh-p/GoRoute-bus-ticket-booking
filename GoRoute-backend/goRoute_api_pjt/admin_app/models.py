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
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='bus_owner')

    
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
    status = models.BooleanField(default=True) 
    def __str__(self):
        return f"{self.user.username}'s Profile"



class OTP(models.Model):
    username = models.CharField(max_length=150)   
    otp_code = models.CharField(max_length=6)   
    created_at = models.DateTimeField(auto_now_add=True)   
    verified = models.BooleanField(default=False) 








#------------------------------------------- BUS OWNER SIDE ----------------------------------------------



class RouteModel(models.Model):
    bus_owner = models.ForeignKey(BusOwnerModel, on_delete=models.CASCADE, related_name='routes')
    route_name = models.CharField(max_length=100)
    start_location = models.CharField(max_length=100)
    end_location = models.CharField(max_length=100)
    distance_in_km = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.route_name} ({self.start_location} to {self.end_location})"




class RouteStopModel(models.Model):
    route = models.ForeignKey(RouteModel, on_delete=models.CASCADE, related_name='stops')
    stop_name = models.CharField(max_length=100)
    stop_order = models.PositiveIntegerField()
    arrival_time = models.TimeField(blank=True, null=True)
    departure_time = models.TimeField(blank=True, null=True)
    distance_in_km = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)

    class Meta:
        ordering = ['stop_order']
        unique_together = ('route', 'stop_order')  

    def __str__(self):
        return f"{self.stop_name} (Order: {self.stop_order})"
