
from rest_framework import serializers
from admin_app.models import *
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()   

    class Meta:
        model = NormalUserProfile
        fields = ['user', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'date_of_birth', 'gender', 'status']



class BusOwnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusOwnerModel
        fields = ['logo_image'] 


class ScheduledStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledStop
        fields = ['stop_name', 'arrival_time', 'departure_time']

class ScheduledBusSerializer(serializers.ModelSerializer):
    stops = ScheduledStopSerializer(many=True)

    class Meta:
        model = ScheduledBus
        fields = ['id','bus_number', 'bus_owner_name', 'bus_type', 'seat_count', 'route', 'scheduled_date', 'status', 'stops','name','seat_type']

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'seat_number',] 

class TicketSerializer(serializers.ModelSerializer):
    seat = SeatSerializer()
    class Meta:
        model = Ticket
        fields = ['id', 'order', 'seat', 'status', 'amount', 'related_data']



class OrderSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=True)  
    bus = ScheduledBusSerializer()
    class Meta:
        model = Order
        fields = ['id','from_city','to_city','date', 'bus', 'status', 'amount', 'created_at', 'email', 'phone_number', 'name', 'tickets']





class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for the Transaction model."""
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'transaction_type', 'timestamp', 'description']

class WalletSerializer(serializers.ModelSerializer):
    """Serializer for the Wallet model with nested Transaction serializer."""
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ['id', 'user', 'balance', 'transactions'] 





