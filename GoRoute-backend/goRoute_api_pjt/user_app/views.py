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
from dotenv import load_dotenv
load_dotenv()
import os
from datetime import timedelta
from rest_framework import status
from datetime import datetime
from django.http import JsonResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
import json
import razorpay
from django.conf import settings
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
        


class UserProfileEditView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, user):
        """
        Fetch the user's profile.
        """
        try:
            return NormalUserProfile.objects.get(user=user)
        except NormalUserProfile.DoesNotExist:
            return None

    def patch(self, request, *args, **kwargs):
        
        user = request.user   
        user_profile = self.get_object(user)

        if user_profile is None:
            return Response({'detail': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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
    

class AllStopsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            stops = ScheduledStop.objects.values_list('stop_name', flat=True).distinct()
            stops_list = sorted(stops)   

            return Response({'stops': stops_list}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class BusSearchView(APIView):
   

   

    # def get(self, request, *args, **kwargs):
    #     print('Bus search working12')

    #     from_city = request.query_params.get('from')
    #     to_city = request.query_params.get('to')
    #     date = request.query_params.get('date')
    #     print(from_city)
    #     print(to_city)
    #     print(date,'date')

    #     if date:
    #         try:
    #             date = datetime.strptime(date, '%Y-%m-%d').date()   
    #         except ValueError:
    #             return Response({'error': 'Invalid date format. It must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
    #     else:
    #         return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

    #     # stops = ScheduledStop.objects.filter(
    #     #     Q(stop_name=from_city) | Q(stop_name=to_city)
    #     # ).order_by('stop_order')
    #     stops = ScheduledStop.objects.filter(
    #         Q(stop_name__iexact=from_city) | Q(stop_name__iexact=to_city)
    #     ).order_by('stop_order')


    #     sample= ScheduledStop.objects.all()
    #     for i in sample:
    #         print(i.stop_name)

    #     print(stops,'stops')

    #     buses_with_stops = []
    #     for stop in stops:
    #         bus = stop.scheduled_bus
    #         stops_on_bus = bus.stops.all().order_by('stop_order')
    #         stop_names = [s.stop_name for s in stops_on_bus]
            
    #         if from_city in stop_names and to_city in stop_names:
    #             start_index = stop_names.index(from_city)
    #             end_index = stop_names.index(to_city)
    #             if start_index < end_index:   
    #                 if bus not in buses_with_stops:
    #                     buses_with_stops.append(bus)

    #     buses_with_stops = [
    #         bus for bus in buses_with_stops
    #         if bus.scheduled_date.date() == date and bus.status == 'active'
    #     ]

    #     buses_with_distances_and_prices = []
    #     for bus in buses_with_stops:
    #         stops_on_bus = bus.stops.all().order_by('stop_order')
    #         stop_names = [s.stop_name for s in stops_on_bus]
            
    #         if from_city in stop_names and to_city in stop_names:
    #             start_index = stop_names.index(from_city)
    #             end_index = stop_names.index(to_city)
                
    #             total_distance = 0
    #             for i in range(start_index+1, end_index+1):
    #                 print(stops_on_bus[i].distance_km, 'calcu')
    #                 total_distance += stops_on_bus[i].distance_km   

    #             # for i in range(start_index + 1, end_index + 1):
    #             #     distance = stops_on_bus[i].distance_km
    #             #     if distance is None:
    #             #         print(f"Warning: Distance for stop {stops_on_bus[i]} is None. Treating it as 0.")
    #             #         distance = 0
    #             #     else:
    #             #         print(f"Adding distance: {distance} km")

    #             #     total_distance += distance

    #             price_per_km = 30 if bus.bus_type.lower() == 'ac' else 20
    #             total_price = total_distance * price_per_km

    #             buses_with_distances_and_prices.append({
    #                 'bus': bus,
    #                 'distance_km': total_distance,
    #                 'price': total_price
    #             })

    #     buses_data = []
    #     for bus_data in buses_with_distances_and_prices:
    #         bus = bus_data['bus']
    #         bus_serializer = ScheduledBusSerializer(bus)
    #         bus_data_serialized = bus_serializer.data   
    #         bus_data_serialized['distance_km'] = bus_data['distance_km']   
    #         bus_data_serialized['price'] = bus_data['price']   
    #         buses_data.append(bus_data_serialized)

    #     return Response({'buses': buses_data}, status=status.HTTP_200_OK)


    def get(self, request, *args, **kwargs):
        print('Bus search working12')

        from_city = request.query_params.get('from', '').strip().lower()
        to_city = request.query_params.get('to', '').strip().lower()
        date = request.query_params.get('date')
        print(from_city)
        print(to_city)
        print(date,'date')

        if date:
            try:
                date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Invalid date format. It must be in YYYY-MM-DD format.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)


        stops = ScheduledStop.objects.filter(
            Q(stop_name__iexact=from_city) | Q(stop_name__iexact=to_city)
        ).order_by('stop_order')


        buses_with_stops = []
        for stop in stops:
            bus = stop.scheduled_bus
            stops_on_bus = bus.stops.all().order_by('stop_order')
            stop_names = [s.stop_name.lower() for s in stops_on_bus]

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
            stop_names = [s.stop_name.lower() for s in stops_on_bus]

            start_index = stop_names.index(from_city)
            end_index = stop_names.index(to_city)
            total_distance = 0

            for i in range(start_index + 1, end_index + 1):
                distance = stops_on_bus[i].distance_km or 0
                total_distance += distance

            price_per_km = 5 if bus.bus_type.lower() == 'ac' else 3
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

            try:
                bus_owner = BusOwnerModel.objects.get(travel_name=bus.bus_owner_name)
                bus_data_serialized['bus_owner_logo'] = bus_owner.logo_image.url if bus_owner.logo_image else None
            except BusOwnerModel.DoesNotExist:
                bus_data_serialized['bus_owner_logo'] = None

            buses_data.append(bus_data_serialized)

        return Response({'buses': buses_data}, status=status.HTTP_200_OK)






class BusSeatDetailsView(APIView):
    
   
    # def get(self, request, bus_id):
    #     print('Bus view is working')
    #     print('Bus ID:', bus_id)

    #     try:
    #         bus = ScheduledBus.objects.get(id=bus_id)
    #         from_city = request.query_params.get('from_city')
    #         to_city = request.query_params.get('to_city')
    #         date = request.query_params.get('date')
    #         print('From City:', from_city)
    #         print('To City:', to_city)
    #         print('Date:', date)

    #         if not from_city or not to_city or not date:
    #             return Response(
    #                 {'error': 'from_city, to_city, and date are required query parameters.'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         try:
    #             date = datetime.strptime(date, '%Y-%m-%d').date()
    #         except ValueError:
    #             return Response(
    #                 {'error': 'Invalid date format. Please use YYYY-MM-DD.'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         seats = Seat.objects.filter(bus=bus, date=date)
    #         stops = bus.stops.order_by('stop_order')
    #         print('Stops:', [stop.stop_name for stop in stops])

    #         search_from_stop = stops.filter(stop_name__iexact=from_city).first()
    #         search_to_stop = stops.filter(stop_name__iexact=to_city).first()

    #         if not search_from_stop or not search_to_stop:
    #             return Response(
    #                 {
    #                     'error': f'Invalid from_city "{from_city}" or to_city "{to_city}". '
    #                              'Please check the route and try again.'
    #                 },
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         search_from_index = search_from_stop.stop_order
    #         search_to_index = search_to_stop.stop_order
    #         print('Search From Index:', search_from_index)
    #         print('Search To Index:', search_to_index)

    #         booked_seat_numbers = []
    #         for seat in seats:
    #             if seat.status == 'booked':
    #                 from_stop = stops.filter(stop_name__iexact=seat.from_city).first()
    #                 to_stop = stops.filter(stop_name__iexact=seat.to_city).first()

    #                 if not from_stop or not to_stop:
    #                     continue

    #                 from_index = from_stop.stop_order
    #                 to_index = to_stop.stop_order

    #                 if from_index < search_to_index and to_index > search_from_index:
    #                     booked_seat_numbers.append(seat.seat_number)

    #         print('Booked Seats:', booked_seat_numbers)
    #         try:
    #             bus_owner = BusOwnerModel.objects.get(travel_name=bus.bus_owner_name)
    #             bus_owner_logo_url = bus_owner.logo_image.url if bus_owner.logo_image else None
    #         except BusOwnerModel.DoesNotExist:
    #             bus_owner_logo_url = None

    #         print(bus_owner_logo_url,'url')

    #         return Response(
    #             {
    #                 'bus': ScheduledBusSerializer(bus).data,
    #                 'booked_seats': booked_seat_numbers,
    #                 'bus_log':bus_owner_logo_url
    #             },
    #             status=status.HTTP_200_OK
    #         )
    #     except ScheduledBus.DoesNotExist:
    #         return Response(
    #             {'error': 'Bus not found'},
    #             status=status.HTTP_404_NOT_FOUND
    #         )

    def get(self, request, bus_id):
        print('Bus view is working')
        print('Bus ID:', bus_id)

        try:
            bus = ScheduledBus.objects.get(id=bus_id)
            from_city = request.query_params.get('from_city')
            to_city = request.query_params.get('to_city')
            date = request.query_params.get('date')
            print('From City:', from_city)
            print('To City:', to_city)
            print('Date:', date)

            if not from_city or not to_city or not date:
                return Response(
                    {'error': 'from_city, to_city, and date are required query parameters.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Please use YYYY-MM-DD.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            stops = bus.stops.order_by('stop_order')
            stop_names = [stop.stop_name.lower() for stop in stops]
            print('Stops:', stop_names)

            if from_city.lower() not in stop_names or to_city.lower() not in stop_names:
                return Response(
                    {'error': f'Invalid from_city "{from_city}" or to_city "{to_city}". Please check the route and try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            start_index = stop_names.index(from_city.lower())
            end_index = stop_names.index(to_city.lower())
            print('Start Index:', start_index)
            print('End Index:', end_index)

            if start_index >= end_index:
                return Response(
                    {'error': 'Invalid route. From city must come before To city.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            total_distance = 0
            for i in range(start_index + 1, end_index + 1):
                distance = stops[i].distance_km or 0
                total_distance += distance

            price_per_km = 5 if bus.bus_type.lower() == 'ac' else 3
            total_price = total_distance * price_per_km

            # Fetch booked seats
            seats = Seat.objects.filter(bus=bus, date=date)
            booked_seat_numbers = []
            for seat in seats:
                if seat.status == 'booked':
                    from_stop = stops.filter(stop_name__iexact=seat.from_city).first()
                    to_stop = stops.filter(stop_name__iexact=seat.to_city).first()

                    if from_stop and to_stop:
                        from_index = from_stop.stop_order
                        to_index = to_stop.stop_order

                        if from_index < end_index and to_index > start_index:
                            booked_seat_numbers.append(seat.seat_number)

            print('Booked Seats:', booked_seat_numbers)

            try:
                bus_owner = BusOwnerModel.objects.get(travel_name=bus.bus_owner_name)
                bus_owner_logo_url = bus_owner.logo_image.url if bus_owner.logo_image else None
            except BusOwnerModel.DoesNotExist:
                bus_owner_logo_url = None
            
            print(total_price,'pricee')
            print(bus_owner_logo_url,'pricee')

            return Response(
                {
                    'bus': ScheduledBusSerializer(bus).data,
                    'booked_seats': booked_seat_numbers,
                    'total_distance': total_distance,
                    'total_price': total_price,
                    'bus_log': bus_owner_logo_url
                },
                status=status.HTTP_200_OK
            )

        except ScheduledBus.DoesNotExist:
            return Response(
                {'error': 'Bus not found'},
                status=status.HTTP_404_NOT_FOUND
            )




   
class SeatBookingView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 
   

    def post(self, request, *args, **kwargs):
        try:
            data = request.data if hasattr(request, 'data') else json.loads(request.body)

            bus_id = data.get('bus_id')
            seat_numbers = data.get('seat_numbers')
            user_name = data.get('userName')
            email = data.get('email')
            phone_number = data.get('phone')
            from_city = data.get('from')   
            to_city = data.get('to')       
            date = data.get('date')
            price_per_person = data.get('pricePerPerson')   

            if price_per_person is None or price_per_person <= 0:
                return JsonResponse({'error': 'Price per person is required and must be a positive value.'}, status=400)

            if not bus_id or not seat_numbers or not email or not phone_number:
                return JsonResponse({'error': 'Bus ID, Seat Numbers, Email, and Phone Number are required.'}, status=400)

            bus = get_object_or_404(ScheduledBus, id=bus_id)
            profile_obj = NormalUserProfile.objects.get(user=request.user)

            with transaction.atomic():
                order = Order.objects.create(
                    user=profile_obj,  
                    bus=bus,
                    email=email,   
                    phone_number=phone_number,   
                    name=user_name,
                    amount=0.00,   
                    status='pending',
                    from_city=from_city,
                    to_city=to_city,
                    date=date
                )
                
                total_amount = 0
                booked_seats = []

                for seat_number in seat_numbers:
                    if Seat.objects.filter(bus=bus, seat_number=seat_number).exists():
                        return JsonResponse({'error': f'Seat {seat_number} is already booked.'}, status=400)

                    seat = Seat.objects.create(
                        bus=bus,
                        seat_number=seat_number,
                        status='booked',
                        from_city=from_city,
                        to_city=to_city,
                        date=date
                    )
                    booked_seats.append(seat)

                    total_amount += price_per_person   

                    Ticket.objects.create(
                        order=order,
                        seat=seat,
                        amount=price_per_person,   
                        status='pending'
                    )
                
                order.amount = total_amount
                order.save()

                razorpay_key_id = os.getenv('RAZORPAY_KEY_ID')
                razorpay_key_secret = os.getenv('RAZORPAY_KEY_SECRET')
                client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
                razorpay_order = client.order.create({
                    "amount": int(total_amount * 100),   
                    "currency": "INR",
                    "receipt": f"order_rcptid_{order.id}",
                    "payment_capture": 1,
                })
                
                order.razorpay_order_id = razorpay_order['id']
                order.save()

            return JsonResponse({
                'message': 'Order created successfully.',
                'order_id': order.id,
                'razorpay_order_id': order.razorpay_order_id,
                'seat_numbers': [seat.seat_number for seat in booked_seats],
                'price_per_person': price_per_person,   
                'total_amount': total_amount   
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


 

class PaymentSuccessAPIView(APIView):
   
    def post(self, request, *args, **kwargs):
        try:
            data = request.data if hasattr(request, 'data') else json.loads(request.body)

            payment_id = data.get('payment_id')
            order_id = data.get('order_id')
            signature = data.get('signature')

            if not payment_id or not order_id or not signature:
                return JsonResponse({'error': 'Payment ID, Order ID, and Signature are required.'}, status=400)

            order = Order.objects.filter(razorpay_order_id=order_id).first()

            if not order:
                return JsonResponse({'error': 'Order not found.'}, status=404)

            razorpay_key_id = os.getenv('RAZORPAY_KEY_ID')
            razorpay_key_secret = os.getenv('RAZORPAY_KEY_SECRET')
            client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
            response = client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })

            if response:
                order.status = 'confirmed'
                order.save()
                return JsonResponse({'message': 'Payment successful and order confirmed.'})

            return JsonResponse({'error': 'Payment verification failed.'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)






class OrderListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        profile_obj = NormalUserProfile.objects.get(user=request.user)
        orders = Order.objects.filter(user=profile_obj)

        serializer = OrderSerializer(orders, many=True)
        return Response({"orders": serializer.data})




class TicketListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, order_id):
        try:
            profile_obj = NormalUserProfile.objects.get(user=request.user)
            order = Order.objects.get(id=order_id, user=profile_obj)
            tickets = Ticket.objects.filter(order=order)
            serializer = TicketSerializer(tickets, many=True)
            order_details = {
            "id": order.id,
            "date": order.date,
            "total_amount": order.amount,
            "status": order.status,
            "from_city":order.from_city,
            "to_city":order.to_city,
            }
            return Response({
                "tickets": serializer.data,
                "order": order_details,
                })
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=404)


