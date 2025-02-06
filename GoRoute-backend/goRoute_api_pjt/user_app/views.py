from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from .serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.timezone import now

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
from decouple import config
from django.utils import timezone
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
from decimal import Decimal

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from django.views import View
from channels.layers import get_channel_layer
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
                    'username': email.split('@')[0],
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
            and not bus.started 
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




from asgiref.sync import async_to_sync

class BusSeatDetailsView(APIView):
    
   
   
    def get(self, request, bus_id):
        print('Bus view is working')
         

        try:
            bus = ScheduledBus.objects.get(id=bus_id)
            from_city = request.query_params.get('from_city')
            to_city = request.query_params.get('to_city')
            date = request.query_params.get('date')
            print('From City:', from_city)
             

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

            if not bus_id or not seat_numbers or not email or not phone_number:
                return JsonResponse({'error': 'Bus ID, Seat Numbers, Email, and Phone Number are required.'}, status=400)

            if price_per_person is None or price_per_person <= 0:
                return JsonResponse({'error': 'Price per person is required and must be a positive value.'}, status=400)

            bus = get_object_or_404(ScheduledBus, id=bus_id)
            profile_obj = NormalUserProfile.objects.get(user=request.user)

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
                date=date,
                selected_seats=seat_numbers  
            )

            razorpay_key_id = os.getenv('RAZORPAY_KEY_ID')
            razorpay_key_secret = os.getenv('RAZORPAY_KEY_SECRET')
            client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

            razorpay_order = client.order.create({
                "amount": int(price_per_person * len(seat_numbers) * 100),   
                "currency": "INR",
                "receipt": f"order_rcptid_{order.id}",
                "payment_capture": 1,
            })

            order.razorpay_order_id = razorpay_order['id']
            order.amount = price_per_person * len(seat_numbers)
            order.save()

            return JsonResponse({
                'message': 'Order created successfully. Please proceed with payment.',
                'order_id': order.id,
                'razorpay_order_id': order.razorpay_order_id,
                'price_per_person': price_per_person,
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

            try:
                client.utility.verify_payment_signature({
                    'razorpay_order_id': order_id,
                    'razorpay_payment_id': payment_id,
                    'razorpay_signature': signature
                })
            except razorpay.errors.SignatureVerificationError:
                return JsonResponse({'error': 'Payment verification failed.'}, status=400)

            order.status = 'confirmed'
            order.save()
 
            

            seat_numbers = order.selected_seats
            if not seat_numbers:
                return JsonResponse({'error': 'No seats specified in the order.'}, status=400)

            booked_seats = []
            total_amount = Decimal(0)

            for seat_number in seat_numbers:
                seat = Seat.objects.create(
                    bus=order.bus,
                    seat_number=seat_number,
                    status='booked',
                    from_city=order.from_city,
                    to_city=order.to_city,
                    date=order.date
                )



                ticket_amount = Decimal(order.amount) / Decimal(len(seat_numbers))
                ticket = Ticket.objects.create(
                    order=order,
                    seat=seat,
                    amount=ticket_amount,
                    status='confirmed'
                )

                booked_seats.append(ticket)
                total_amount += ticket.amount

            order.amount = total_amount
            order.save()

            super_admin = CustomUser.objects.filter(role='super_admin').first()
            if super_admin:
                admin_wallet, _ = Wallet.objects.get_or_create(user=super_admin)

                admin_credit = total_amount * Decimal('0.05')  
                admin_wallet.credit(admin_credit)
                

                Transaction.objects.create(
                    wallet=admin_wallet,
                    amount=admin_credit,
                    transaction_type='credit',
                    description=f"Admin credited with 5% of the total booking amount: {admin_credit:.2f}"
                )

                bus_owner = CustomUser.objects.get(id=order.bus.bus_owner_id)
                bus_owner_wallet, _ = Wallet.objects.get_or_create(user=bus_owner)

                bus_owner_credit = total_amount * Decimal('0.95')   
                bus_owner_wallet.credit(bus_owner_credit)

                Transaction.objects.create(
                    wallet=bus_owner_wallet,
                    amount=bus_owner_credit,
                    transaction_type='credit',
                    description=f"Bus owner credited with 95% of the total booking amount: {bus_owner_credit:.2f}"
                )

            
            user_email = order.email
            seat_details = "\n".join([f"Seat Number: {ticket.seat.seat_number}, Status: {ticket.status}" for ticket in booked_seats])
            email_subject = "Your Ticket Booking Confirmation"
            email_message = f"""
            Dear {order.name},

            Your booking has been confirmed. Below are your ticket details:

            Seats:
            {seat_details}

            Total Amount: {total_amount}

            Thank you for booking with us!

            Best Regards,
            The GoRoute Team
            """

            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
            )

            return JsonResponse({
                'message': 'Payment successful and order confirmed.',
                'seat_numbers': [ticket.seat.seat_number for ticket in booked_seats],
                'total_amount': float(total_amount)
            })

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
            "bus_id": order.bus.id,
            "bus_number": order.bus.bus_number,
            "bus": order.bus.bus_number,
            "bus_owner_name": order.bus.bus_owner_name,
            "bus_started": order.bus.started,
            }
            return Response({
                "tickets": serializer.data,
                "order": order_details,
                })
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=404)





class WalletAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            print('wallet is working')
            
            wallet, created = Wallet.objects.get_or_create(user=request.user)
           
            serializer = WalletSerializer(wallet)
            transactions = wallet.transaction_set.all()

            wallet_data = serializer.data
            wallet_data['transactions'] = TransactionSerializer(transactions, many=True).data
            return Response(wallet_data, status=200)
        except Wallet.DoesNotExist:
            return Response({"error": "Wallet not found for the current user."}, status=404)

    
      

class CancelTicketAPIView(APIView):
   
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

   
   

    def post(self, request, ticket_id):
        try:
            ticket = Ticket.objects.select_related('order__user', 'order__bus', 'seat').get(id=ticket_id)

            if ticket.status == 'cancelled':
                return Response({'success': False, 'message': 'Ticket is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

            ticket.status = 'cancelled'
            ticket.related_data = f"Cancelled on {timezone.now()}"
            ticket.save()

            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            refund_amount = Decimal(str(ticket.amount))  
            wallet.balance += refund_amount
            wallet.save()

            Transaction.objects.create(
                wallet=wallet,
                amount=refund_amount,
                transaction_type='credit',
                description=f"Refund for cancelled ticket (Seat: {ticket.seat.seat_number})"
            )

            bus = ticket.order.bus
            if bus.bus_owner_id:
                bus_owner = CustomUser.objects.get(id=bus.bus_owner_id)
                bus_owner_wallet, _ = Wallet.objects.get_or_create(user=bus_owner)
                debit_amount = Decimal(str(ticket.amount))  
                bus_owner_wallet.balance -= debit_amount
                bus_owner_wallet.save()

                Transaction.objects.create(
                    wallet=bus_owner_wallet,
                    amount=debit_amount,
                    transaction_type='debit',
                    description=f"Debit for cancelled ticket (Seat: {ticket.seat.seat_number})"
                )

            if ticket.seat:
                ticket.seat.delete()

            return Response({
                'success': True,
                'message': 'Ticket cancelled successfully, refund issued, seat released, and bus owner debited.',
                'refund_amount': str(refund_amount),
                'wallet_balance': str(wallet.balance),
                'bus_owner_wallet_balance': str(bus_owner_wallet.balance) if bus_owner_wallet else 'Not available'
            }, status=status.HTTP_200_OK)

        except Ticket.DoesNotExist:
            return Response({'success': False, 'message': 'Ticket not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'success': False, 'message': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class BusTrackingAPIView(APIView):
    def get(self, request, bus_id):
        try:
            print('is working veiew')
            scheduled_bus = ScheduledBus.objects.get(id=bus_id)
            stops = ScheduledStop.objects.filter(scheduled_bus=scheduled_bus).order_by('stop_order')

            current_stop = scheduled_bus.current_stop
            current_stop_data = None
            next_stops = []
            total_stops = []

            for stop in stops:
                total_stops.append(stop)
                if stop.stop_name == current_stop:
                    current_stop_data = stop
                elif current_stop_data:
                    next_stops.append(stop)

            bus_data = ScheduledBusSerializer(scheduled_bus).data
            current_stop_serialized = ScheduledStopSerializer(current_stop_data).data if current_stop_data else None
            if current_stop_serialized:
                current_stop_serialized['stop_number'] = scheduled_bus.stop_number  
            next_stops_serialized = ScheduledStopSerializer(next_stops, many=True).data
            total_stops_serialized = ScheduledStopSerializer(total_stops, many=True).data   

            response_data = {
                "bus": bus_data,
                "current_stop": current_stop_serialized,
                "next_stops": next_stops_serialized,
                "total_stops": total_stops_serialized,
            }

            return Response(response_data)

        except ScheduledBus.DoesNotExist:
            raise NotFound("Bus not found")
        





class ScheduledBusListView(ListAPIView):
    
    queryset = ScheduledBus.objects.filter(started=False, scheduled_date__gte=now())   
    serializer_class = ScheduledBusDetailSerializer2 




class ForgotPasswordCheckView(APIView):

    def post(self, request, *args, **kwargs):
        print('check is working')
        username = request.data.get('username')

        if not username:
            return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.role not in ['normal_user', 'bus_owner']:
            return Response({"error": "Password reset is not allowed for this user role."}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": "Username is valid and allowed to change the password."}, status=status.HTTP_200_OK)





class ForgotPasswordUpdateView(APIView):
   

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        new_password = request.data.get('new_password')

        if not username or not new_password:
            return Response({"error": "Username and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = get_user_model().objects.get(username=username)
        except get_user_model().DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.role not in ['normal_user', 'bus_owner']:
            return Response({"error": "Password reset is not allowed for this user role."}, status=status.HTTP_403_FORBIDDEN)

        if len(new_password) < 5:
            return Response({"error": "Password must be at least 5 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)













class ChatPeopleListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print("hello")
        print(request.user, 'con')
        
        try:
            current_user_id = request.user.id   
            current_user_name = request.user.first_name 
            print(current_user_id,'id')
            conductor = request.user.conductor_profile   
        except Conductor.DoesNotExist:
            return Response({"error": "User is not a conductor"}, status=400)
        
        try:
            conductor_scheduled_bus = conductor.scheduled_bus.scheduled_bus
        except ConductorScheduledBus.DoesNotExist:
            return Response({"error": "Conductor has no assigned scheduled bus"}, status=400)

        orders = Order.objects.filter(bus=conductor_scheduled_bus, status='confirmed')
        
        users_with_orders = NormalUserProfile.objects.filter(orders__in=orders).distinct()

        chat_people = []
        for user in users_with_orders:
            last_message = "Some message"   
            last_message_time = "10:30 AM"  
            unread_count = Ticket.objects.filter(order__user=user, status='confirmed').count()   
            chat_people.append({
                # "id": user.id,
                "id": user.user.id, 
                "name": user.first_name,   
                "lastMessage": last_message,
                "time": last_message_time,
                "unreadCount": unread_count,
            })

        return Response({"chatPeople": chat_people,"currentUser": {
                "id": current_user_id,
            },})

    



class MessageAPIView(APIView):
    permission_classes = [IsAuthenticated]   
    authentication_classes = [JWTAuthentication]

   
    def get(self, request, person_id, *args, **kwargs):
        print('GET is working')

        user = request.user

        if user.role != 'conductor':
            return Response({"error": "Only conductors can access messages."}, status=status.HTTP_403_FORBIDDEN)

        to_user = get_object_or_404(CustomUser, id=person_id)

        room = get_object_or_404(ChatRoom, from_user=user, to_user=to_user)

        messages = Message.objects.filter(room=room).order_by('timestamp')

        message_serializer = MessageSerializer(messages, many=True)

        chat_room_serializer = ChatRoomSerializer(room)

        return Response({
            'chat_room': chat_room_serializer.data,   
            'messages': message_serializer.data,   
        }, status=status.HTTP_200_OK)
    
    
    def post(self, request, person_id, *args, **kwargs):
        print('POST is working')

        user = request.user

        if user.role != 'conductor':
            return Response({"error": "Only conductors can send messages."}, status=status.HTTP_403_FORBIDDEN)

        to_user = get_object_or_404(CustomUser, id=person_id)

        room, created = ChatRoom.objects.get_or_create(from_user=user, to_user=to_user)

        message_content = request.data.get('message')   

        if not message_content:
            return Response({"error": "Message content cannot be empty!"}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(user=user, room=room, message=message_content)
        serializer = MessageSerializer(message)

        return Response(serializer.data, status=status.HTTP_201_CREATED)




class ConductorMessagesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            user = request.user
            current_user_id = user.id 
            rooms = ChatRoom.objects.filter(to_user=user)
            print(rooms, 'rooms')

            conductor_list = []
            for room in rooms:
                print(room, 'room')

                conductors = Message.objects.filter(room=room).values('user').distinct()

                for conductor_data in conductors:
                    conductor = CustomUser.objects.get(id=conductor_data['user'])

                    if conductor == user:
                        continue

                    last_message = Message.objects.filter(
                        user=conductor, room=room
                    ).order_by('-timestamp').first()

                    if last_message:
                        conductor_list.append({
                            'id': conductor.id,
                            'name': conductor.username,  
                            'time': last_message.timestamp.strftime('%I:%M %p'),
                            'lastMessage': last_message.message,
                            'room_id': room.room_id
                        })
                        

            return Response({'conductors': conductor_list,'currentUser': {'id': current_user_id},})

        except Exception as e:
            print(f"Error: {str(e)}")   
            return Response({'error': str(e)}, status=500)



 

class MessageListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]   

    def get(self, request, conductor_id, *args, **kwargs):
        print('list working')
        user = request.user

        try:
            chat_room = ChatRoom.objects.get(from_user_id=conductor_id, to_user=user)
            print(chat_room, 'room')

            messages = Message.objects.filter(room=chat_room).order_by('timestamp')

            message_serializer = MessageSerializer(messages, many=True)

            chat_room_serializer = ChatRoomSerializer(chat_room)

            return Response({
                'chat_room': chat_room_serializer.data,   
                'messages': message_serializer.data,   
            }, status=status.HTTP_200_OK)

        except ChatRoom.DoesNotExist:
            return Response({'error': 'Chat room not found for this conductor'}, status=status.HTTP_404_NOT_FOUND)














class SendMessageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('post is wring ')
        user = request.user
        message_text = request.data.get('message')
        room_id = request.data.get('room_id')

        if not message_text or not room_id:
            return Response({'error': 'Message text and room_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_room = ChatRoom.objects.get(room_id=room_id)

            if user not in [chat_room.from_user, chat_room.to_user]:
                return Response({'error': 'You are not part of this chat room'}, status=status.HTTP_403_FORBIDDEN)

            message = Message.objects.create(room=chat_room, user=user, message=message_text)

            serializer = MessageSerializer(message)
            return Response({'message': serializer.data}, status=status.HTTP_201_CREATED)

        except ChatRoom.DoesNotExist:
            return Response({'error': 'Chat room not found'}, status=status.HTTP_404_NOT_FOUND)







class UserDashboardAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print('get is working')

        user = request.user  
        print('get is working2')
        
        try:
            normal_user_profile = user.profile   
            print('get is working3')
        except NormalUserProfile.DoesNotExist:
            print('get is working4')
            return Response({"error": "User profile not found"}, status=400)

        wallet, created = Wallet.objects.get_or_create(user=user, defaults={'balance': 0})
        if created:
            print('New wallet created')
            wallet.save() 
        wallet_balance = wallet.balance

        active_tickets_count = Ticket.objects.filter(order__user=normal_user_profile, status='confirmed').count()
        total_trips = Ticket.objects.filter(order__user=normal_user_profile, status='completed').count()

        recent_bookings = Order.objects.filter(user=normal_user_profile).order_by('-created_at')[:5]

        bookings_data = [
            {
                'from': booking.from_city,
                'to': booking.to_city,
                'date': booking.date.strftime('%Y-%m-%d'),
                'status': booking.status.capitalize()
            }
            for booking in recent_bookings
        ]

        data = {
            'stats': [
                {'title': 'Active Tickets', 'value': active_tickets_count},
                {'title': 'Wallet Balance', 'value': f'₹{wallet_balance}'},
                {'title': 'Total Trips', 'value': total_trips},
            ],
            'recentBookings': bookings_data
        }

        return Response(data)

