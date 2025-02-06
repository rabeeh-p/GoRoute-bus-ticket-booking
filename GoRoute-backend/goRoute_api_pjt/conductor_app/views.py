from django.shortcuts import render


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from admin_app.models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
# Create your views here.



class ConductorLoginView(APIView):
    
    
    def post(self, request):
        print('login is wokring')
        username = request.data.get('username')
        password = request.data.get('password')
        print(username,password,'itemsss')

        if not username or not password:
            return Response({"error": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        conductor_user = authenticate(request, username=username, password=password)
        print(conductor_user,'user')

        if conductor_user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            conductor = conductor_user.conductor_profile   
            
          

        except Conductor.DoesNotExist:
            return Response({"error": "Conductor profile data not found."}, status=status.HTTP_400_BAD_REQUEST)

        if conductor_user.role == 'conductor':
            user_type = 'conductor'
        

        refresh = RefreshToken.for_user(conductor_user)
        access_token = refresh.access_token

        return Response({
            "message": "Login successful.",
            "token": str(access_token),
            "conductor_id": conductor.id,
            "name": conductor.name,
            "user_type": "conductor"   
        }, status=status.HTTP_200_OK)








class ConductorDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  
        print('is wokring')
        conductor = get_object_or_404(Conductor, user=user)
        print(user, 'userrrr2')

        if not conductor.is_active:
            return Response({"detail": "Conductor is not active."}, status=status.HTTP_200_OK)

         
        print('is 0')
        conductor_scheduled_bus = ConductorScheduledBus.objects.filter(conductor=conductor).first()
        print('is first')
        if not conductor_scheduled_bus:
            print('second')
            return Response({"detail": "You have no bus assigned.", "bus_data": None, "stops": None}, status=status.HTTP_200_OK)
        print('third')

        scheduled_bus = conductor_scheduled_bus.scheduled_bus

        scheduled_stops = ScheduledStop.objects.filter(scheduled_bus=scheduled_bus).order_by('stop_order')

        bus_data = ScheduledBusSerializer(scheduled_bus)
        stops_data = ScheduledStopSerializer(scheduled_stops, many=True)

        data = {
            "bus": bus_data.data,
            "current_stop": scheduled_bus.stop_number,   
            "stops": stops_data.data
        }

        return Response(data, status=status.HTTP_200_OK)









class UpdateCurrentStop(APIView):

    
    def post(self, request, *args, **kwargs):
        stop_order = request.data.get('stop_order')
        bus_id = request.data.get('bus_id')

        if not bus_id or stop_order is None:
            return Response({"error": "Bus ID and Stop Order are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bus = ScheduledBus.objects.get(id=bus_id)
        except ScheduledBus.DoesNotExist:
            return Response({"error": "Bus not found."}, status=status.HTTP_404_NOT_FOUND)

        stops = self.get_stops_for_bus(bus)

        if stop_order < 0 or stop_order >= len(stops):
            return Response({"error": "Invalid stop order."}, status=status.HTTP_400_BAD_REQUEST)

        bus.current_stop = stops[stop_order].stop_name
        bus.stop_number = stop_order
        bus.save()
        tickets = Ticket.objects.filter(order__bus=bus, status='confirmed')

        if stop_order == len(stops) - 1:
            try:
                with transaction.atomic():
                    bus_model = BusModel.objects.get(bus_number=bus.bus_number)
                    bus_model.is_active = False
                    bus_model.Scheduled = False
                    bus_model.save()

                    bus.status = 'completed'
                    bus.save()


                    tickets = Ticket.objects.filter(order__bus=bus, status='confirmed')
                    tickets.update(status='completed')

                    user = request.user
                    conductor = Conductor.objects.get(user=user)

                    conductor.is_active = False
                    conductor.save()
                    ConductorScheduledBus.objects.filter(conductor=conductor).delete()


            except BusModel.DoesNotExist:
                return Response({"error": "Bus model with the given bus number not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        self.send_email_to_ticket_holders(tickets)

        return Response({"success": "Current stop updated successfully."}, status=status.HTTP_200_OK)




    def get_stops_for_bus(self, bus):
        stops = ScheduledStop.objects.filter(scheduled_bus=bus).order_by('stop_order')
        return stops
    
    def send_email_to_ticket_holders(self, tickets):
        for ticket in tickets:
            order = ticket.order
            user_email = order.email
            seat_details = "\n".join([f"Seat Number: {ticket.seat.seat_number}, Status: {ticket.status}" for ticket in ticket.order.seats.all()])
            email_subject = "Update on Your Bus Trip: Current Stop Reached"
            email_message = f"""
            Dear {order.name},

            The bus {ticket.order.bus.bus_number} has reached a new stop: {ticket.order.bus.current_stop}.
            Below are your ticket details:

            Seats:
            {seat_details}

            Thank you for traveling with us!

            Best Regards,
            The GoRoute Team
            """

            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
            )





class ForgotPasswordCheckView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UsernameCheckSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            
            try:
                user = get_user_model().objects.get(username=username)
                
                if user.role != 'conductor':
                    return Response({"error": "You are not conductor."}, status=status.HTTP_403_FORBIDDEN)
                
                return Response({"message": "Username exists, proceed to reset password."}, status=status.HTTP_200_OK)
            
            except get_user_model().DoesNotExist:
                return Response({"error": "Username not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class ForgotPasswordUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        print('updations is wokring')
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']

            if new_password != confirm_password:
                return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = get_user_model().objects.get(username=username)
                user.password = make_password(new_password)   
                user.save()
                return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                return Response({"error": "Username not found."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class StartJourneyView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('is post is working')
        bus_id = request.data.get('busId')
        try:
            bus = ScheduledBus.objects.get(id=bus_id)

            bus.started = True
            bus.save()

            orders = Order.objects.filter(bus=bus, status='confirmed')
            users_with_orders = NormalUserProfile.objects.filter(orders__in=orders).distinct()

            conductor = request.user

            for user in users_with_orders:
                 
                chat_room, created = ChatRoom.objects.get_or_create(
                    from_user=conductor,   
                    to_user=user.user      
                )

                message_text = f"Your bus journey has started! The bus number {bus.bus_number} is now on its way."

                Message.objects.create(
                    user=conductor,   
                    room=chat_room,    
                    message=message_text,
                    timestamp=timezone.now()   
                )

                print(f"Sending message to {user.first_name}: {message_text}")

            return Response({'message': 'Journey started and messages sent to the users in their chat rooms.'}, status=status.HTTP_200_OK)

        except ScheduledBus.DoesNotExist:
            return Response({'error': 'Scheduled bus not found for the given bus ID.'}, status=status.HTTP_404_NOT_FOUND)

