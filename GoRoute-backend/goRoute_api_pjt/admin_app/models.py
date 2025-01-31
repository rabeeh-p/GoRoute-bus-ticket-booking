from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal
import uuid
# Create your models here.


# Role choices
ROLE_CHOICES = (
    ('super_admin', 'Super Admin'),
    ('bus_owner', 'Bus Owner'),
    ('normal_user', 'Normal User'),
    ('conductor', 'Conductor'), 
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
    document = models.FileField(upload_to='bus_owner_documents/', blank=True, null=True)
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
    bus_owner_id = models.PositiveIntegerField(null=True, blank=True)
    current_stop = models.CharField(max_length=255, null=True, blank=True)
    stop_number = models.IntegerField(null=True, blank=True)

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
    from_city = models.CharField(max_length=100, blank=True, null=True)   
    to_city = models.CharField(max_length=100, blank=True, null=True)   
    date = models.DateField(blank=True, null=True)   


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
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    selected_seats = models.JSONField(blank=True, null=True)
     

    def __str__(self):
        return f"Order by {self.user} - Status: {self.status}"
    


class Ticket(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='seats')  
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='tickets')
    status = models.CharField(
        max_length=20,
        choices=[ ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'),('completed', 'Completed')],
        default='issued'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    related_data = models.TextField(blank=True, null=True)   

    def __str__(self):
        return f"Ticket for Seat {self.seat.seat_number} - Status: {self.status}"
    





class Wallet(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username}'s Wallet"

    def credit(self, amount):
        """Credits the given amount to the user's wallet."""
        amount = Decimal(amount)
        self.balance += amount
        self.save()
    
        
    def debit(self, amount):
        """Debits the given amount from the user's wallet."""
        amount = Decimal(amount)
        if self.balance >= amount:
            self.balance -= amount
            self.save()
        else:
            raise ValueError("Insufficient balance")
        




class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    ]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=6, choices=TRANSACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

    def __str__(self):
        return f"Transaction {self.id} - {self.transaction_type} of {self.amount}"




class StopStatusUpdate(models.Model):
    stop = models.ForeignKey(ScheduledStop, on_delete=models.CASCADE, related_name='status_updates')   
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)   
    scheduled_bus = models.ForeignKey(ScheduledBus, on_delete=models.CASCADE, related_name='status_updates')   
    status = models.CharField(max_length=50, choices=[('on_time', 'On Time'), ('delayed', 'Delayed'), ('arrived', 'Arrived')])  
    updated_at = models.DateTimeField(auto_now=True)   

    def __str__(self):
        return f"Status update for {self.stop.stop_name} on Bus {self.scheduled_bus.bus_number} by {self.user.username} at {self.updated_at}"



class Conductor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='conductor_profile')  
    license_number = models.CharField(max_length=100, unique=True)   
    phone_number = models.CharField(max_length=15, null=True, blank=True)   
    hired_date = models.DateField(null=True, blank=True)   
    name = models.CharField(max_length=255,null=True, blank=True) 
    travels = models.ForeignKey(
        BusOwnerModel, 
        on_delete=models.CASCADE, 
        related_name='conductors'
    )  
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"Conductor {self.user.username} (License: {self.license_number})"
    


class ConductorScheduledBus(models.Model):
    conductor = models.OneToOneField(
        Conductor, 
        on_delete=models.CASCADE, 
        related_name='scheduled_bus'   
    )
    scheduled_bus = models.ForeignKey(
        ScheduledBus, 
        on_delete=models.CASCADE, 
        related_name='conductor_schedules'
    )   
    shift_date = models.DateField(null=True, blank=True)   
    shift_start_time = models.TimeField(null=True, blank=True)   
    shift_end_time = models.TimeField(null=True, blank=True)  

    def __str__(self):
        return f"Conductor {self.conductor.user.username} on Bus {self.scheduled_bus.bus_number} - {self.shift_date or 'No Date'}"




class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    room_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    from_user = models.ForeignKey(CustomUser, related_name='from_rooms', on_delete=models.CASCADE, limit_choices_to={'role': 'conductor'})
    to_user = models.ForeignKey(CustomUser, related_name='to_rooms', on_delete=models.CASCADE, limit_choices_to={'role': 'normal_user'})





class Message(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

