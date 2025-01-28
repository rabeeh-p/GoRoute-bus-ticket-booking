from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import *
from rest_framework import status
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import *

from django.core.mail import send_mail
from django.conf import settings
import random
import time
from django.utils import timezone
from datetime import timedelta

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
import json
from django.views import View
from collections import defaultdict



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
        

        user_data = {
            "username": request.data.get("username"),
            "password": request.data.get("password"),
            "role": request.data.get("role"),
            "email": request.data.get("email"),
        }
        bus_owner_data = {
            "travel_name": request.data.get("travel_name"),
            "address": request.data.get("address"),
            "contact_number": request.data.get("contact_number"),
        }



        logo_image = request.FILES.get("logo_image")
        print('lgo image',logo_image)

        if logo_image:
            bus_owner_data['logo_image'] = logo_image
        


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

        user_role = user.role

        if user_role == 'bus_owner':
            try:
                bus_owner = user.bus_owner
                if bus_owner and not bus_owner.is_approved:
                    return Response({"error": "Your account is pending approval. Please wait for admin approval."}, status=status.HTTP_403_FORBIDDEN)
            except BusOwnerModel.DoesNotExist:
                return Response({"error": "Bus owner data not found."}, status=status.HTTP_400_BAD_REQUEST)
            
            user_type = 'bus_owner'
        
        
        elif user_role == 'super_admin':
            return Response({"error": "Super admin access is not allowed in this area."}, status=status.HTTP_403_FORBIDDEN)

        elif user_role == 'normal_user':
            try:
                profile = user.profile   
                if not profile.status:   
                    return Response({"error": "Your account is deactivated. Please contact support."}, status=status.HTTP_403_FORBIDDEN)
            except NormalUserProfile.DoesNotExist:
                return Response({"error": "Normal user profile data not found."}, status=status.HTTP_400_BAD_REQUEST)

            user_type = 'normal_user'

        else:
            return Response({"error": "Invalid user role."}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'userType': user_type   
        }, status=status.HTTP_200_OK)



class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.role != 'super_admin':  
            return Response({"error": "Unauthorized access, only super admins are allowed to log in."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_type': user.role
        }, status=status.HTTP_200_OK)
    



# -------------------- ADMIN USER SECTION------------------------------------------------

class UserSignupView(APIView):
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        user_data = serializer.validated_data
        user_data['date_of_birth'] = user_data['date_of_birth'].strftime('%Y-%m-%d')

        otp_code = random.randint(100000, 999999)

        otp_entry = OTP.objects.create(
            username=user_data['username'],
            otp_code=str(otp_code),
            verified=False   
        )

        send_mail(
            subject="Your OTP for Registration",
            message=f"Your OTP is {otp_code}. It expires in 5 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_data['email']],
        )

        return Response({"message": "OTP sent to your email. Please verify."}, status=status.HTTP_200_OK)





class OtpVerificationView(APIView):
    def post(self, request):
        otp = request.data.get("otp")
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        date_of_birth = request.data.get("date_of_birth")
        phone_number = request.data.get("phone_number")
        gender = request.data.get("gender")

        if not otp or not username or not email or not password or not first_name or not last_name or not date_of_birth or not phone_number or not gender:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        otp_entry = OTP.objects.filter(username=username, otp_code=otp, verified=False).first()
        
        if not otp_entry:
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() - otp_entry.created_at > timedelta(minutes=5):
            otp_entry.delete()   
            return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

        otp_entry.verified = True
        otp_entry.save()

        otp_entry.delete()

        user = get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        profile = NormalUserProfile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            gender=gender

        )

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)




class UserProfileListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        print('admn is workign')
        profiles = NormalUserProfile.objects.all()
        serializer = NormalUserProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    




class UserProfileDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        print('is working')
        try:
            
            profile = NormalUserProfile.objects.get(user__id=user_id)
            serializer = NormalUserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NormalUserProfile.DoesNotExist:
            raise NotFound("User profile not found.")
        



class ToggleUserStatusView(APIView):
    authentication_classes = [JWTAuthentication]   
    permission_classes = [IsAuthenticated]   

    def post(self, request, user_id):
        try:
            user_profile = NormalUserProfile.objects.get(user__id=user_id)

            user_profile.status = not user_profile.status
            user_profile.save()

            return Response(
                {"status": user_profile.status, "message": "User status updated successfully!"},
                status=status.HTTP_200_OK
            )

        except NormalUserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found!"},
                status=status.HTTP_404_NOT_FOUND
            )
        

# --------------------------------- ADMIN USER SECTION END -----------------------




# ---------------------- BUS OWNER SECTION -----------------------------------------

class ApprovedBusOwnersView(APIView):
    authentication_classes = [JWTAuthentication]   
    permission_classes = [IsAuthenticated]

    def get(self, request):
        approved_bus_owners = BusOwnerModel.objects.filter(is_approved=True)
        
        serializer = BusOwnerSerializer2(approved_bus_owners, many=True)
        
        return Response(serializer.data)
    


class BusOwnerRequestListView(APIView):
    authentication_classes = [JWTAuthentication]   
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        bus_owners = BusOwnerModel.objects.filter(is_approved=False)  
        serializer = BusOwnerSerializer2(bus_owners, many=True)  
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class BusOwnerDetailView(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]  

   
    def get(self, request, id, *args, **kwargs):
        try:
            print('get is working')
            user = CustomUser.objects.get(id=id)
            bus_owner = BusOwnerModel.objects.get(user=user)
            serializer = BusOwnerSerializer2(bus_owner)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except BusOwnerModel.DoesNotExist:
            return Response({"error": "Bus owner not found for this user"}, status=status.HTTP_404_NOT_FOUND)
        

    

    def put(self, request, id, format=None):
        try:
            print(id, 'idd')
            print('put  is working')

            bus_owner = BusOwnerModel.objects.get(user=id)
            print(bus_owner, 'owner')
            print(request.data, 'data')
        except BusOwnerModel.DoesNotExist:
            return Response({'detail': 'Bus owner not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_travel_name = request.data.get('travel_name', '').strip()

        if BusOwnerModel.objects.filter(travel_name=new_travel_name).exclude(pk=bus_owner.pk).exists():
            return Response(
                {'detail': f'A bus owner with the travel name "{new_travel_name}" already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = BusOwnerSerializerWithoutLogo(bus_owner, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors, 'err')

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def patch(self, request, id, *args, **kwargs):
        
        print('patch is  working')
        bus_owner = get_object_or_404(BusOwnerModel, user=id)
        print(bus_owner,'bus owner')
        try:
            body = json.loads(request.body)
            is_approved = body.get('is_approved')

            if is_approved is not None:
                bus_owner.is_approved = is_approved
                bus_owner.save()
                return JsonResponse({'message': 'Status updated successfully.'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid data provided.'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON provided.'}, status=400)
        



class AcceptBusOwnerView(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]  


    def post(self, request, id, *args, **kwargs):
        
        try:
            print('acpet is working')
            user = CustomUser.objects.get(id=id)

            bus_owner = BusOwnerModel.objects.get(user=user)
            print(bus_owner,'buss3')

            bus_owner.is_approved = True   
            bus_owner.save()

            return Response(
                {"message": f"Bus owner request for {bus_owner.travel_name} has been accepted."},
                status=status.HTTP_200_OK
            )

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except BusOwnerModel.DoesNotExist:
            return Response({"error": "Bus owner not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )






# ------------------------------------ BUS OWNER SECTION END --------------------------






class LogoutView(APIView):
    
    def post(self, request, *args, **kwargs):

        print("logout is working")
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()   
            except Exception as e:
                return JsonResponse({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
        response = JsonResponse({"message": "Logged out successfully"})
        
        response.delete_cookie('access_token')   
        response.delete_cookie('refresh_token')   
        
        return response






# ------------------------------------ bus requests --------------------------



class PendingBusesView(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]
    def get(self, request):
        pending_buses = BusModel.objects.filter(is_active=False)
        serializer = BusSerializerPending(pending_buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



class BusDetailsView(APIView):
    def get(self, request, pk, format=None):
        try:
            bus = BusModel.objects.get(pk=pk)

            serializer = BusSerializerPending(bus)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except BusModel.DoesNotExist:
            return Response({"detail": "Bus not found."}, status=status.HTTP_404_NOT_FOUND)





class ApproveBusRequestView(APIView):
    
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]

    def post(self, request, bus_id):
        print('user',request.user)
        print(bus_id)
        bus_request = get_object_or_404(BusModel, id=bus_id)
        print(bus_request,'bus')
        
        if bus_request.is_active:
            return Response({"message": "This bus request has already been approved."}, status=status.HTTP_400_BAD_REQUEST)

        bus_request.is_active = True
        bus_request.save()
        return Response({"message": "Bus request approved successfully."}, status=status.HTTP_200_OK)


class RejectBusRequestView(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]
    
    def post(self, request, bus_id):
        bus_request = get_object_or_404(BusModel, id=bus_id)
        
        bus_request.delete()
        
        return Response({"message": "Bus request rejected and deleted successfully."}, status=status.HTTP_200_OK)
    



class CreateUserByAdmin(APIView):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        date_of_birth = request.data.get("date_of_birth")
        phone_number = request.data.get("phone_number")
        gender = request.data.get("gender")

        if not username or not email or not password or not first_name or not last_name or not date_of_birth or not phone_number or not gender:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if get_user_model().objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        if get_user_model().objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        profile = NormalUserProfile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            gender=gender
        )

        return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)



class AdminScheduledBusListView(APIView):
    permission_classes = [IsAuthenticated]   

    def get(self, request):
        try:
            scheduled_buses = ScheduledBus.objects.all().order_by('scheduled_date')
            serializer = ScheduledBusSerializer(scheduled_buses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": "An error occurred while fetching the bus schedule."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )






class ScheduledBusDataView(View):
    def get(self, request):
        filter_type = request.GET.get('filter_type', 'weekly')   
        
        current_date = timezone.now()
        
        if filter_type == 'weekly':
            start_date = current_date - timedelta(weeks=1)
        elif filter_type == 'monthly':
            start_date = current_date - timedelta(weeks=4)   
        elif filter_type == 'yearly':
            start_date = current_date - timedelta(weeks=52)  # 
        else:
            start_date = current_date

        buses = ScheduledBus.objects.filter(
            scheduled_date__gte=start_date, 
            status='active'
        )
        
        chart_data = []
        for bus in buses:
            chart_data.append({
                'bus': bus.bus_number,
                'bus_owner': bus.bus_owner_name,
                'scheduled_date': bus.scheduled_date.strftime('%Y-%m-%d %I:%M %p'),
                'route': bus.route,
                'seat_count': bus.seat_count,
            })

        return JsonResponse(chart_data, safe=False)











