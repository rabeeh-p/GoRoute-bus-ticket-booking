
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
        fields = ['stop_name', 'arrival_time', 'departure_time','stop_order']

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











class ScheduledBusDetailSerializer2(serializers.ModelSerializer):
    first_stop = serializers.SerializerMethodField()
    last_stop = serializers.SerializerMethodField()

    class Meta:
        model = ScheduledBus
        fields = ['bus_number', 'bus_owner_name', 'route', 'scheduled_date', 'status', 'seat_count', 'first_stop', 'last_stop']

    def get_first_stop(self, obj):
        first_stop = obj.stops.order_by('stop_order').first()
        if first_stop:
            return ScheduledStopSerializer(first_stop).data
        return None

    def get_last_stop(self, obj):
        last_stop = obj.stops.order_by('stop_order').last()
        if last_stop:
            return ScheduledStopSerializer(last_stop).data
        return None




class MessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()   
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")   

    class Meta:
        model = Message
        fields = ['user', 'message', 'timestamp']


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'room_id', 'from_user', 'to_user']

