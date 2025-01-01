from rest_framework import serializers
from .models import BusOwnerModel
from django.contrib.auth import get_user_model



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'role']   
        extra_kwargs = {
            'password': {'write_only': True}   
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class BusOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusOwnerModel
        fields = ['user', 'travel_name', 'address', 'contact_number']