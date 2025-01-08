from rest_framework import serializers
from admin_app.models import *

class RouteModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteModel
        fields = ['id', 'bus_owner', 'route_name', 'start_location', 'end_location', 'distance_in_km', 'is_active']

    def validate_distance_in_km(self, value):
        if value <= 0:
            raise serializers.ValidationError("Distance must be a positive value.")
        return value
    
    def validate_route_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Route name must be at least 3 characters.")
        return value





class RouteStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStopModel
        fields = ['id', 'route', 'stop_name', 'stop_order', 'arrival_time', 'departure_time', 'distance_in_km']