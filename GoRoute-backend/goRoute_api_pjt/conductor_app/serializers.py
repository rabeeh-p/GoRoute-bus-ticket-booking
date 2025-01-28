from rest_framework import serializers
from admin_app.models import *



class ScheduledBusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledBus
        fields = '__all__'

class ScheduledStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledStop
        fields = '__all__'






class UsernameCheckSerializer(serializers.Serializer):
    username = serializers.CharField()


class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()




