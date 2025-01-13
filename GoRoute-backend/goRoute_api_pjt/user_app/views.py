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
from django.http import JsonResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
import json
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

            try:
                bus_owner = BusOwnerModel.objects.get(travel_name=bus.bus_owner_name)
                bus_data_serialized['bus_owner_logo'] = bus_owner.logo_image.url if bus_owner.logo_image else None
            except BusOwnerModel.DoesNotExist:
                bus_data_serialized['bus_owner_logo'] = None

            buses_data.append(bus_data_serialized)

        return Response({'buses': buses_data}, status=status.HTTP_200_OK)






class BusSeatDetailsView(APIView):
    
    # def get(self, request, bus_id):
    #     print('bus view is working')
    #     print('id', bus_id)

    #     try:
    #         bus = ScheduledBus.objects.get(id=bus_id)
    #         from_city = request.query_params.get('from_city')
    #         to_city = request.query_params.get('to_city')
    #         date = request.query_params.get('date')
    #         print(from_city)
    #         print(to_city,'to city')

    #         print(date,'date')


    #         # booked_seats = Seat.objects.filter(bus=bus, status='booked')
    #         # booked_seat_numbers = [seat.seat_number for seat in booked_seats]

    #         seats = Seat.objects.filter(bus=bus, date=date)
    #         stops = bus.stops.order_by('stop_order') 
    #         booked_seat_numbers = []
    #         for seat in seats:
    #             if seat.status == 'booked':
    #                 # Get the from_city and to_city stop objects
    #                 from_stop = stops.filter(stop_name=seat.from_city).first()
    #                 to_stop = stops.filter(stop_name=seat.to_city).first()

    #                 # Handle cases where either from_stop or to_stop is not found
    #                 if not from_stop or not to_stop:
    #                     continue  # Skip this seat if the city is not in the route

    #                 from_index = from_stop.stop_order
    #                 to_index = to_stop.stop_order

    #                 # Handle search_from_index and search_to_index with proper null checks
    #                 search_from_stop = stops.filter(stop_name=from_city).first()
    #                 search_to_stop = stops.filter(stop_name=to_city).first()

    #                 # Ensure both search stops are found
    #                 if not search_from_stop or not search_to_stop:
    #                     continue  # Skip the seat if any of the searched cities is not in the route

    #                 search_from_index = search_from_stop.stop_order
    #                 search_to_index = search_to_stop.stop_order

    #                 # Case 1: Full route booking (Malappuram to Kasargod)
    #                 if from_index <= search_from_index and to_index >= search_to_index:
    #                     booked_seat_numbers.append(seat.seat_number)

    #                 # Case 2: Partial segment booking (Malappuram to Kozhikode)
    #                 elif from_index <= search_from_index and to_index >= search_from_index:
    #                     booked_seat_numbers.append(seat.seat_number)
                    
       

    #         return Response(
    #             {
    #                 'bus': ScheduledBusSerializer(bus).data,   
    #                 'booked_seats': booked_seat_numbers   
    #             },
    #             status=status.HTTP_200_OK
    #         )
    #     except ScheduledBus.DoesNotExist:
    #         return Response(
    #             {'error': 'Bus not found'},
    #             status=status.HTTP_404_NOT_FOUND
    #         )

    #  def get(self, request, bus_id):
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

    #         # Validate query parameters
    #         if not from_city or not to_city or not date:
    #             return Response(
    #                 {'error': 'from_city, to_city, and date are required query parameters.'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )

    #         # Validate date format
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

    #         # Find stop indices with case-insensitive search
    #         search_from_stop = stops.filter(stop_name__iexact=from_city).first()
    #         search_to_stop = stops.filter(stop_name__iexact=to_city).first()

    #         # Handle missing stops
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

    #                 # Handle missing stops for booked seats
    #                 if not from_stop or not to_stop:
    #                     continue

    #                 from_index = from_stop.stop_order
    #                 to_index = to_stop.stop_order

    #                 # Case 1: Full route booking
    #                 if from_index <= search_from_index and to_index >= search_to_index:
    #                     booked_seat_numbers.append(seat.seat_number)

    #                 # Case 2: Partial segment booking
    #                 elif from_index <= search_from_index and to_index >= search_from_index:
    #                     booked_seat_numbers.append(seat.seat_number)

    #         print('Booked Seats:', booked_seat_numbers)

    #         return Response(
    #             {
    #                 'bus': ScheduledBusSerializer(bus).data,
    #                 'booked_seats': booked_seat_numbers
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

            seats = Seat.objects.filter(bus=bus, date=date)
            stops = bus.stops.order_by('stop_order')
            print('Stops:', [stop.stop_name for stop in stops])

            search_from_stop = stops.filter(stop_name__iexact=from_city).first()
            search_to_stop = stops.filter(stop_name__iexact=to_city).first()

            if not search_from_stop or not search_to_stop:
                return Response(
                    {
                        'error': f'Invalid from_city "{from_city}" or to_city "{to_city}". '
                                 'Please check the route and try again.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            search_from_index = search_from_stop.stop_order
            search_to_index = search_to_stop.stop_order
            print('Search From Index:', search_from_index)
            print('Search To Index:', search_to_index)

            booked_seat_numbers = []
            for seat in seats:
                if seat.status == 'booked':
                    from_stop = stops.filter(stop_name__iexact=seat.from_city).first()
                    to_stop = stops.filter(stop_name__iexact=seat.to_city).first()

                    if not from_stop or not to_stop:
                        continue

                    from_index = from_stop.stop_order
                    to_index = to_stop.stop_order

                    if from_index < search_to_index and to_index > search_from_index:
                        booked_seat_numbers.append(seat.seat_number)

            print('Booked Seats:', booked_seat_numbers)

            return Response(
                {
                    'bus': ScheduledBusSerializer(bus).data,
                    'booked_seats': booked_seat_numbers
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

    # def post(self, request, *args, **kwargs):
    #     """
    #     Handle booking multiple seats by creating new seats and associating them with an order and ticket.
    #     """
    #     try:
    #         # Get the bus ID and a list of seat numbers from the request data
    #         bus_id = request.POST.get('bus_id')
    #         seat_numbers = request.POST.getlist('seat_numbers')  # This will get a list of seat numbers
            
    #         # Validate input
    #         if not bus_id or not seat_numbers:
    #             return JsonResponse({'error': 'Bus ID and Seat Numbers are required.'}, status=400)
            
    #         # Get the bus object
    #         bus = get_object_or_404(ScheduledBus, id=bus_id)
            
    #         # Start a transaction to ensure atomicity
    #         with transaction.atomic():
    #             # Create an order for the user
    #             order = Order.objects.create(
    #                 user=request.user.profile,  # Assuming `NormalUserProfile` is related to the user
    #                 bus=bus,
    #                 amount=0.00,  # Amount will be calculated dynamically based on seats
    #                 status='confirmed'
    #             )
                
    #             total_amount = 0
    #             booked_seats = []
                
    #             # Loop through the seat numbers and create seats if they don't already exist
    #             for seat_number in seat_numbers:
    #                 # Check if the seat is already booked
    #                 if Seat.objects.filter(bus=bus, seat_number=seat_number).exists():
    #                     return JsonResponse({'error': f'Seat {seat_number} is already booked.'}, status=400)
                    
    #                 # Create the seat for the bus
    #                 seat = Seat.objects.create(
    #                     bus=bus,
    #                     seat_number=seat_number,
    #                     status='booked'
    #                 )
    #                 booked_seats.append(seat)
    #                 total_amount += 500.00  # Example amount for each seat
                    
    #                 # Create a ticket for the seat
    #                 Ticket.objects.create(
    #                     order=order,
    #                     seat=seat,
    #                     amount=500.00,  # Amount per seat
    #                     status='issued'
    #                 )
                
    #             # Update the order amount with the total cost for the booked seats
    #             order.amount = total_amount
    #             order.save()
            
    #         # Return success response
    #         return JsonResponse({
    #             'message': 'Seats booked successfully.',
    #             'order_id': order.id,
    #             'seat_numbers': [seat.seat_number for seat in booked_seats],
    #             'total_amount': total_amount
    #         })

    #     except Exception as e:
    #         return JsonResponse({'error': str(e)}, status=500)
        

    def post(self, request, *args, **kwargs):
        """
        Handle booking multiple seats by creating new seats and associating them with an order and ticket.
        """
        try:
            data = request.data if hasattr(request, 'data') else json.loads(request.body)
            

            bus_id = data.get('bus_id')
            seat_numbers = data.get('seat_numbers')
            user_name = data.get('userName')
            email = data.get('email')
            phone_number = data.get('phone')
            from_city = data.get('from')  # Get the from city
            to_city = data.get('to')      # Get the to city
            date = data.get('date') 

            print(request.data,'data')
            print(bus_id)
            print(seat_numbers)
            print(email)
            print(phone_number,'phone')
            
            # Validate input
            if not bus_id or not seat_numbers or not email or not phone_number:
                return JsonResponse({'error': 'Bus ID, Seat Numbers, Email, and Phone Number are required.'}, status=400)
            
            # Get the bus object
            bus = get_object_or_404(ScheduledBus, id=bus_id)
            print(bus,'buss ')
            print(request.user,'userrrname')


           
            

            profile_obj = NormalUserProfile.objects.get(user=request.user)
            print(profile_obj.id,'profil id')


            with transaction.atomic():
                order = Order.objects.create(
                    user=profile_obj,  
                    bus=bus,
                    email=email,   
                    phone_number=phone_number,   
                    name=user_name,
                    amount=0.00,   
                    status='confirmed',
                    from_city=from_city,
                    to_city= to_city,
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
                    total_amount += 500.00   
                    
                    Ticket.objects.create(
                        order=order,
                        seat=seat,
                        amount=500.00,   
                        status='confirmed'
                    )
                
                order.amount = total_amount
                order.save()
            
            return JsonResponse({
                'message': 'Seats booked successfully.',
                'order_id': order.id,
                'seat_numbers': [seat.seat_number for seat in booked_seats],
                'total_amount': total_amount
            })
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)






class OrderListView(APIView):
    # permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 
    
    def get(self, request):
        # user = request.user
        profile_obj = NormalUserProfile.objects.get(user=request.user)
        orders = Order.objects.filter(user=profile_obj)

        serializer = OrderSerializer(orders, many=True)
        return Response({"orders": serializer.data})




class TicketListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, order_id):
        # user = request.user
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


