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
    start_datetime = models.DateTimeField(null=True, blank=True)
    
    

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





class BusType(models.Model):
    
    BUS_TYPE_CHOICES = [
        ('ac', 'AC Bus'),
        ('non_ac', 'Non-AC Bus'),
        # ('sleeper_ac', 'Sleeper AC Bus'),
        # ('non_ac_sleeper', 'Non-AC Sleeper'),
        # ('semi_sleeper', 'Semi Sleeper'),
    ]

    SEAT_TYPE_CHOICES = [
        ('standard', 'Standard'),
        # ('recliner', 'Recliner'),
        ('luxury', 'Luxury'),
        ('semi_sleeper', 'Semi Sleeper'),
        ('full_sleeper', 'Full Sleeper'),
    ]

    SEAT_COUNT_CHOICES = [
        (20, '20 Seats'),
        (30, '30 Seats'),
        (40, '40 Seats'),
        # (50, '50 Seats'),
        # (60, '60 Seats'),
    ]

    name = models.CharField(max_length=100, choices=BUS_TYPE_CHOICES)
    seat_type = models.CharField(max_length=50, choices=SEAT_TYPE_CHOICES, default='standard')
    seat_count = models.IntegerField(choices=SEAT_COUNT_CHOICES)   
    description = models.TextField(blank=True, null=True)   

    def __str__(self):
        return f"{self.get_name_display()} - {self.get_seat_type_display()} ({self.seat_count} Seats)"



class BusModel(models.Model):
    bus_owner = models.ForeignKey(BusOwnerModel, on_delete=models.CASCADE, related_name='buses')
    bus_type = models.ForeignKey(BusType, on_delete=models.SET_NULL, null=True, related_name='buses')
    bus_number = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=False)
    description = models.TextField(null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    bus_document = models.FileField(upload_to='bus_documents/', null=True, blank=True)
    Scheduled= models.BooleanField(default=False)
    



class ScheduledBus(models.Model):
    bus_number = models.CharField(max_length=20)   
    bus_owner_name = models.CharField(max_length=100)   
    bus_type = models.CharField(max_length=100)   
    seat_type = models.CharField(max_length=50)   
    seat_count = models.IntegerField()   
    route = models.CharField(max_length=255)   
    scheduled_date = models.DateTimeField()   
    status = models.CharField(max_length=50, choices=[('active', 'Active'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='active')
    description = models.TextField(blank=True, null=True)   
    started= models.BooleanField(default=False)
    name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Scheduled Bus {self.bus_number} on {self.scheduled_date}"
    




class ScheduledStop(models.Model):
    scheduled_bus = models.ForeignKey(ScheduledBus, on_delete=models.CASCADE, related_name='stops')   
    stop_name = models.CharField(max_length=255)   
    stop_order = models.IntegerField()   
    arrival_time = models.TimeField()   
    departure_time = models.TimeField()   
    description = models.TextField(blank=True, null=True)   
    distance_km = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Stop: {self.stop_name}, Arrival: {self.arrival_time}, Departure: {self.departure_time}"
    


class Seat(models.Model):
    bus = models.ForeignKey(ScheduledBus, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.PositiveIntegerField()   
    status = models.CharField(
        max_length=20,
        choices=[('available', 'Available'), ('booked', 'Booked')],
        default='available'
    )
    from_city = models.CharField(max_length=100, blank=True, null=True)  # Optional field
    to_city = models.CharField(max_length=100, blank=True, null=True)  # Optional field
    date = models.DateField(blank=True, null=True)  # Optional fiel


    def __str__(self):
        return f"Seat {self.seat_number} on Bus {self.bus.bus_number}"

    class Meta:
        unique_together = ('bus', 'seat_number')   




class Order(models.Model):
    user = models.ForeignKey(NormalUserProfile, on_delete=models.CASCADE, related_name='orders')
    bus = models.ForeignKey(ScheduledBus, on_delete=models.CASCADE, related_name='bus_ordering_time')
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')],
        default='pending'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(max_length=255, blank=True, null=True)  
    phone_number = models.CharField(max_length=15, blank=True, null=True) 
    name = models.CharField(max_length=255, blank=True, null=True) 
    from_city = models.CharField(max_length=255, blank=True, null=True)
    to_city = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Order by {self.user} - Status: {self.status}"
    


class Ticket(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='seats')  
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='tickets')
    status = models.CharField(
        max_length=20,
        choices=[ ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')],
        default='issued'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    related_data = models.TextField(blank=True, null=True)   

    def __str__(self):
        return f"Ticket for Seat {self.seat.seat_number} - Status: {self.status}"