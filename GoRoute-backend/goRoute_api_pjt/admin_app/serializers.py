from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
import re
from datetime import date


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
        fields = ['user', 'travel_name', 'address', 'contact_number','logo_image']

    def validate_travel_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Travel name should be at least 3 characters long.")
        return value
    





class UserSignupSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone_number = serializers.CharField(max_length=15)
    gender = serializers.ChoiceField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')])
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField()
    date_of_birth = serializers.DateField()

    def validate_email(self, value):
        if get_user_model().objects.filter(email=value).exists():
            raise ValidationError("Email already exists.")
        return value

    def validate_username(self, value):
        if get_user_model().objects.filter(username=value).exists():
            raise ValidationError("Username already exists.")
        return value

    def validate_phone_number(self, value):
        if not re.match(r'^\d{10,15}$', value):
            raise ValidationError("Phone number must be between 10 and 15 digits.")
        return value
    
    def validate_date_of_birth(self, value):
        today = date.today()
        if today.year - value.year < 18 or (today.year - value.year == 18 and (today.month, today.day) < (value.month, value.day)):
            raise serializers.ValidationError("You must be at least 18 years old.")
        return value

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'date_of_birth' in representation:
            representation['date_of_birth'] = representation['date_of_birth'].strftime('%Y-%m-%d')
        return representation
    



class NormalUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalUserProfile
        fields = ['user', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'date_of_birth', 'gender','status']





class BusOwnerSerializer2(serializers.ModelSerializer):
    class Meta:
        model = BusOwnerModel
        fields = ['user','travel_name', 'address', 'contact_number', 'logo_image', 'created_date']