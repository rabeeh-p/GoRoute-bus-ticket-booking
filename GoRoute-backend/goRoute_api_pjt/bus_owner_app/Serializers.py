from rest_framework import serializers
from admin_app.models import *
from django.utils.timezone import now

class RouteModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteModel
        fields = ['id', 'bus_owner', 'route_name', 'start_location', 'end_location', 'distance_in_km', 'is_active','start_datetime']

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



class BusTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusType
        fields = ['id','name', 'seat_type', 'seat_count', 'description']



class BusModelSerializer2(serializers.ModelSerializer):
    bus_type = BusTypeSerializer() 

    class Meta:
        model = BusModel
        fields = ['id','bus_type', 'name','bus_owner', 'bus_number', 'description', 'is_active','Scheduled','bus_document']

    def create(self, validated_data):
        return BusModel.objects.create(**validated_data)

class BusModelSerializer(serializers.ModelSerializer):
    bus_type = serializers.PrimaryKeyRelatedField(queryset=BusType.objects.all())

    class Meta:
        model = BusModel
        fields = ['bus_type', 'name', 'bus_owner', 'bus_number', 'description', 'is_active','bus_document']

    
    def validate_name(self, value):
         
        user = self.context.get('request').user  
        if user:
            try:
                bus_owner = BusOwnerModel.objects.get(user=user)   
            except BusOwnerModel.DoesNotExist:
                raise serializers.ValidationError("User is not associated with a bus owner.")
            
            if BusModel.objects.filter(bus_owner=bus_owner, name=value).exists():
                raise serializers.ValidationError("A bus with this name already exists for this bus owner.")
        
        return value
    
    def validate_bus_number(self, value):
        
        user = self.context.get('request').user   
        if user:
            try:
                bus_owner = BusOwnerModel.objects.get(user=user)   
            except BusOwnerModel.DoesNotExist:
                raise serializers.ValidationError("User is not associated with a bus owner.")
            
            if BusModel.objects.filter(bus_owner=bus_owner, bus_number=value).exists():
                raise serializers.ValidationError("A bus with this number already exists for this bus owner.")
        
        return value

    def create(self, validated_data):
        return BusModel.objects.create(**validated_data)







class ScheduledStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledStop
        fields = ['id', 'stop_name', 'stop_order', 'arrival_time', 'departure_time', 'description']

class ScheduledBusSerializer(serializers.ModelSerializer):
    stops = ScheduledStopSerializer(many=True, read_only=True)

    class Meta:
        model = ScheduledBus
        fields = ['id', 'bus_number','name', 'bus_owner_name', 'bus_type', 'seat_type', 'seat_count', 'route', 'scheduled_date', 'status', 'description', 'started', 'stops']




class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__' 



class TicketSerializer(serializers.ModelSerializer):
    seat_number = serializers.IntegerField(source='seat.seat_number')   
    ticket_status = serializers.CharField(source='status')   
    ticket_amount = serializers.DecimalField(source='amount', max_digits=10, decimal_places=2)   

    class Meta:
        model = Ticket
        fields = ['seat_number', 'ticket_status', 'ticket_amount','id']




class BusOwnerSerializerProfileUpdate(serializers.ModelSerializer):
    logo_image = serializers.ImageField(required=False, allow_null=True)  
    
    class Meta:
        model = BusOwnerModel
        fields = ['id', 'travel_name', 'address', 'contact_number', 'logo_image', 'created_date', 'is_approved','document' ]
    
    def validate_travel_name(self, value):
        instance = self.instance
        if instance and instance.travel_name != value and BusOwnerModel.objects.filter(travel_name=value).exists():
            raise serializers.ValidationError("Travel name must be unique.")
        return value
    





class ConductorRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)   
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Conductor
        fields = ['username', 'password', 'license_number', 'phone_number', 'hired_date','name']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = CustomUser.objects.create_user(
            username=username, password=password, role='conductor'
        )

        conductor = Conductor.objects.create(user=user, **validated_data)
        return conductor
    








class ScheduledBusSerializerForConductor(serializers.ModelSerializer):
    class Meta:
        model = ScheduledBus
        fields = ['id', 'bus_number', 'name', 'route', 'scheduled_date']


class ConductorScheduledBusSerializer(serializers.ModelSerializer):
    scheduled_bus = ScheduledBusSerializerForConductor()

    class Meta:
        model = ConductorScheduledBus
        fields = ['scheduled_bus', 'shift_date', 'shift_start_time', 'shift_end_time']


class ConductorSerializer(serializers.ModelSerializer):
    scheduled_bus_details = ConductorScheduledBusSerializer(source='scheduled_bus', read_only=True)

    class Meta:
        model = Conductor
        fields = [
            'id',
            'user',
            'license_number',
            'phone_number',
            'hired_date',
            'name',
            'travels',
            'is_active',
            'scheduled_bus_details',
        ]
