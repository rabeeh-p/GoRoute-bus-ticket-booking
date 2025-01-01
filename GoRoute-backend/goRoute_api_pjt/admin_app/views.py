from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import BusOwnerModel
from .serializers import *
from rest_framework import status
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, BusOwnerModel
# Create your views here.

def hello(request):
    return HttpResponse("hello")

def get_bus_stations(request):
    data = [
        {"id": 1, "name": "Station 1"},
        {"id": 2, "name": "Station 2"},
        {"id": 3, "name": "Station 3"},
    ]
    return JsonResponse(data, safe=False)




class UserAndBusOwnerRegisterView(APIView):
    def post(self, request):
        user_data = request.data.get('user')
        bus_owner_data = request.data.get('bus_owner')

        user_serializer = CustomUserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            bus_owner_data['user'] = user.id   
            bus_owner_serializer = BusOwnerSerializer(data=bus_owner_data)

            if bus_owner_serializer.is_valid():
                bus_owner_serializer.save()
                return Response(bus_owner_serializer.data, status=status.HTTP_201_CREATED)
            return Response(bus_owner_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if hasattr(user, 'bus_owner'):  
            bus_owner = user.bus_owner.first()   
            if bus_owner and not bus_owner.is_approved:   
                return Response({"error": "Your account is pending approval. Please wait for admin approval."}, status=status.HTTP_403_FORBIDDEN)
        


        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)