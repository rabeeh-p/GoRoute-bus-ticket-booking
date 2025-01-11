
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
