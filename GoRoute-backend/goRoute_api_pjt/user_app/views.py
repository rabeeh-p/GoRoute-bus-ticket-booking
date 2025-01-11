from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from .serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication


from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
from decouple import config

from django.db.models import Q
from django.utils.dateparse import parse_datetime

from datetime import timedelta
from rest_framework import status
from datetime import datetime
# Create your views here.


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]   

    def get(self, request):
        try:
            user_profile = NormalUserProfile.objects.get(user=request.user)
            if not user_profile.status:
                return Response({"detail": "Your account is deactivated. Please contact support.", "deactivated": True}, status=403)
            
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data)
        except NormalUserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=404)
        





class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        client_id = config('SOCIAL_AUTH_GOOGLE_CLIENT_ID')   
        
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            email = idinfo['email']
            name = idinfo['name']

            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': name,
                    'is_active': True,   
                }
            )

            if created:
                NormalUserProfile.objects.create(user=user, first_name=name)

            refresh = RefreshToken.for_user(user)

            user_profile_serializer = UserProfileSerializer(user.profile)   

            return Response({
                "status": "success",
                "message": "Google login successful",
                "user": user_profile_serializer.data,   
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }, status=200)

        except ValueError:
            return Response({"error": "Invalid token"}, status=400)
    






class BusSearchView(APIView):
   

   

    def get(self, request, *args, **kwargs):
        print('Bus search working')

        from_city = request.query_params.get('from')
        to_city = request.query_params.get('to')
        date = request.query_params.get('date')

        if date:
            try:
                date = datetime.strptime(date, '%Y-%m-%d').date()   
            except ValueError:
                return Response({'error': 'Invalid date format. It must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

        stops = ScheduledStop.objects.filter(
            Q(stop_name=from_city) | Q(stop_name=to_city)
        ).order_by('stop_order')

        buses_with_stops = []
        for stop in stops:
            bus = stop.scheduled_bus
            stops_on_bus = bus.stops.all().order_by('stop_order')
            stop_names = [s.stop_name for s in stops_on_bus]
            
            if from_city in stop_names and to_city in stop_names:
                start_index = stop_names.index(from_city)
                end_index = stop_names.index(to_city)
                if start_index < end_index:   
                    if bus not in buses_with_stops:
                        buses_with_stops.append(bus)

        buses_with_stops = [
            bus for bus in buses_with_stops
            if bus.scheduled_date.date() == date and bus.status == 'active'
        ]

        buses_with_distances_and_prices = []
        for bus in buses_with_stops:
            stops_on_bus = bus.stops.all().order_by('stop_order')
            stop_names = [s.stop_name for s in stops_on_bus]
            
            if from_city in stop_names and to_city in stop_names:
                start_index = stop_names.index(from_city)
                end_index = stop_names.index(to_city)
                
                total_distance = 0
                for i in range(start_index+1, end_index+1):
                    print(stops_on_bus[i].distance_km, 'calcu')
                    total_distance += stops_on_bus[i].distance_km   

                price_per_km = 30 if bus.bus_type.lower() == 'ac' else 20
                total_price = total_distance * price_per_km

                buses_with_distances_and_prices.append({
                    'bus': bus,
                    'distance_km': total_distance,
                    'price': total_price
                })

        buses_data = []
        for bus_data in buses_with_distances_and_prices:
            bus = bus_data['bus']
            bus_serializer = ScheduledBusSerializer(bus)
            bus_data_serialized = bus_serializer.data   
            bus_data_serialized['distance_km'] = bus_data['distance_km']   
            bus_data_serialized['price'] = bus_data['price']   
            buses_data.append(bus_data_serialized)

        return Response({'buses': buses_data}, status=status.HTTP_200_OK)






class BusSeatDetailsView(APIView):
    def get(self, request, bus_id):
        print('bus view is working')
        print('id', bus_id)

        try:
            bus = ScheduledBus.objects.get(id=bus_id)

            seat_data = [
                {
                    'seat_number': seat_number,
                    'status': 'available',   
                    'type': bus.seat_type   
                }
                for seat_number in range(1, bus.seat_count + 1)   
            ]

            return Response(
                {
                    'bus': ScheduledBusSerializer(bus).data,
                    'seats': seat_data
                },
                status=status.HTTP_200_OK
            )
        except ScheduledBus.DoesNotExist:
            return Response(
                {'error': 'Bus not found'},
                status=status.HTTP_404_NOT_FOUND
            )








