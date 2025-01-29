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






# class ConductorDashboardView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         user = request.user  
#         conductor = get_object_or_404(Conductor, user=user)
#         print(user, 'userrrr2')

#         if not conductor.is_active:
#             return Response({"detail": "Conductor is not active."}, status=status.HTTP_400_BAD_REQUEST)

#         conductor_scheduled_bus = get_object_or_404(ConductorScheduledBus, conductor=conductor)

#         scheduled_bus = conductor_scheduled_bus.scheduled_bus

#         scheduled_stops = ScheduledStop.objects.filter(scheduled_bus=scheduled_bus).order_by('stop_order')

#         bus_data = ScheduledBusSerializer(scheduled_bus)
#         stops_data = ScheduledStopSerializer(scheduled_stops, many=True)

#         data = {
#             "bus": bus_data.data,
#             "current_stop": scheduled_bus.stop_number,   
#             "stops": stops_data.data
#         }

#         return Response(data, status=status.HTTP_200_OK)
   

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

        # Check if the conductor has an assigned bus
        print('is 0')
        conductor_scheduled_bus = ConductorScheduledBus.objects.filter(conductor=conductor).first()
        print('is first')
        if not conductor_scheduled_bus:
            print('second')
            # If no bus assigned, return a response with a custom message and no data
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







# class UpdateCurrentStop(APIView):
    

#     def post(self, request, *args, **kwargs):
#         stop_order = request.data.get('stop_order')
#         bus_id = request.data.get('bus_id')

#         if not bus_id or stop_order is None:
#             return Response({"error": "Bus ID and Stop Order are required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             bus = ScheduledBus.objects.get(id=bus_id)
#         except ScheduledBus.DoesNotExist:
#             return Response({"error": "Bus not found."}, status=status.HTTP_404_NOT_FOUND)

#         stops = self.get_stops_for_bus(bus)
        
#         if stop_order < 0 or stop_order >= len(stops):
#             return Response({"error": "Invalid stop order."}, status=status.HTTP_400_BAD_REQUEST)

#         bus.current_stop = stops[stop_order].stop_name   
#         bus.stop_number=stop_order
#         bus.save()

#         bus.started = True
#         bus.save()

#         return Response({"success": "Current stop updated successfully."}, status=status.HTTP_200_OK)

#     def get_stops_for_bus(self, bus):
        
#         stops = ScheduledStop.objects.filter(scheduled_bus=bus).order_by('stop_order')
#         return stops



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

         

        if stop_order == len(stops) - 1:
            try:
                with transaction.atomic():  
                    bus_model = BusModel.objects.get(bus_number=bus.bus_number)
                    bus_model.is_active = False
                    bus_model.Scheduled = False
                    bus_model.save()

                    bus.stops.all().delete()

                    bus.delete()

                    user = request.user
                    conductor = Conductor.objects.get(user=user)

                    conductor.is_active = False
                    conductor.save()

            except BusModel.DoesNotExist:
                return Response({"error": "Bus model with the given bus number not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        

        return Response({"success": "Current stop updated successfully."}, status=status.HTTP_200_OK)

    def get_stops_for_bus(self, bus):
        stops = ScheduledStop.objects.filter(scheduled_bus=bus).order_by('stop_order')
        return stops



# class ForgotPasswordCheckView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = UsernameCheckSerializer(data=request.data)
#         if serializer.is_valid():
#             username = serializer.validated_data['username']
#             try:
#                 user = get_user_model().objects.get(username=username)
#                 return Response({"message": "Username exists, proceed to reset password."}, status=status.HTTP_200_OK)
#             except get_user_model().DoesNotExist:
#                 return Response({"error": "Username not found."}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ForgotPasswordCheckView(APIView):
    def post(self, request, *args, **kwargs):
        # Assuming you're using a serializer for validating the username
        serializer = UsernameCheckSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            
            try:
                # Get the user from the database
                user = get_user_model().objects.get(username=username)
                
                # Check if the user is a conductor
                if user.role != 'conductor':
                    return Response({"error": "You are not conductor."}, status=status.HTTP_403_FORBIDDEN)
                
                # Proceed if the user is a conductor
                return Response({"message": "Username exists, proceed to reset password."}, status=status.HTTP_200_OK)
            
            except get_user_model().DoesNotExist:
                return Response({"error": "Username not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        # If the serializer data is not valid
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
                user.password = make_password(new_password)  # Hash the new password
                user.save()
                return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
            except get_user_model().DoesNotExist:
                return Response({"error": "Username not found."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# class StartJourneyView(APIView):
#     def post(self, request, *args, **kwargs):
#         print('psted is working')
#         bus_id = request.data.get('busId')
#         try:
#             # Fetch the ScheduledBus instance using the bus_id
#             bus = ScheduledBus.objects.get(id=bus_id)

#             # Set the 'started' field to True and save
#             bus.started = True
#             bus.save()

#             return Response({'message': 'Journey started successfully.'}, status=status.HTTP_200_OK)

#         except ScheduledBus.DoesNotExist:
#             return Response({'error': 'Scheduled bus not found for the given bus ID.'}, status=status.HTTP_404_NOT_FOUND)


class StartJourneyView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('is post is working')
        bus_id = request.data.get('busId')
        try:
            # Fetch the ScheduledBus instance using the bus_id
            bus = ScheduledBus.objects.get(id=bus_id)

            # Set the 'started' field to True and save
            bus.started = True
            bus.save()

            # Fetch the confirmed orders and booked users
            orders = Order.objects.filter(bus=bus, status='confirmed')
            users_with_orders = NormalUserProfile.objects.filter(orders__in=orders).distinct()

            # Get conductor information (assuming user is the conductor)
            conductor = request.user

            # Send message to each booked user
            for user in users_with_orders:
                # Check if the chat room exists, if not, create one
                chat_room, created = ChatRoom.objects.get_or_create(
                    from_user=conductor,  # The conductor is the sender
                    to_user=user.user      # The user who booked the ticket
                )

                # Craft the message for the user
                message_text = f"Your bus journey has started! The bus number {bus.bus_number} is now on its way."

                # Create and save the message in the database
                Message.objects.create(
                    user=conductor,  # The user sending the message (conductor)
                    room=chat_room,   # The chat room created or fetched
                    message=message_text,
                    timestamp=timezone.now()  # The time when the message was sent
                )

                # Optional: If you need to send messages in a chat system or push notification
                print(f"Sending message to {user.first_name}: {message_text}")

            return Response({'message': 'Journey started and messages sent to the users in their chat rooms.'}, status=status.HTTP_200_OK)

        except ScheduledBus.DoesNotExist:
            return Response({'error': 'Scheduled bus not found for the given bus ID.'}, status=status.HTTP_404_NOT_FOUND)

