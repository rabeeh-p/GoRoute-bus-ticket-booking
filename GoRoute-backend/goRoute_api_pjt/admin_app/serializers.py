from rest_framework import serializers
from .models import BusOwnerModel
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator



class CustomUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(queryset=get_user_model().objects.all())]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=get_user_model().objects.all())]
    )

    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'email', 'role']
        extra_kwargs = {
            'password': {'write_only': True}   
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class BusOwnerSerializer(serializers.ModelSerializer):
    travel_name = serializers.CharField(
        max_length=100,
        validators=[UniqueValidator(queryset=BusOwnerModel.objects.all())]
    )

    class Meta:
        model = BusOwnerModel
        fields = ['user', 'travel_name', 'address', 'contact_number']

    def validate_travel_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Travel name should be at least 3 characters long.")
        return value