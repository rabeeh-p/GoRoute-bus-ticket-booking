from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from admin_app.serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from decimal import Decimal

from .Serializers import *


# Create your views here.



class BusOwnerProfileView(APIView):
    permission_classes = [IsAuthenticated]   
    authentication_classes = [JWTAuthentication]  

    def get(self, request, *args, **kwargs):
        try:
            bus_owner = BusOwnerModel.objects.get(user=request.user)
            
            serializer = BusOwnerSerializer(bus_owner)
            return Response(serializer.data)
        except BusOwnerModel.DoesNotExist:
            return Response({"error": "Bus owner profile not found."}, status=404)
        




class RouteCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = request.user
        print('user',user)

        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
            print('busowner',bus_owner)
        except BusOwnerModel.DoesNotExist:
            return Response(
                {"error": "Bus owner does not exist for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND
            )

        # data = request.data.copy()
        data = request.data
        data['bus_owner'] = bus_owner.id
        print("Incoming Data:", data)

        mapped_data = {
            'route_name': data.get('routeName'),
            'start_location': data.get('startLocation'),
            'end_location': data.get('endLocation'),
            'distance_in_km': data.get('distanceInKm'),
            'bus_owner': data.get('bus_owner'),
            'start_datetime': data.get('startDatetime'),
            
        }

        serializer = RouteModelSerializer(data=mapped_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('is not validated')
            print("Validation Errors:", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class RouteByOwnerView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
        except BusOwnerModel.DoesNotExist:
            return Response(
                {"error": "Bus owner does not exist for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND
            )

        routes = RouteModel.objects.filter(bus_owner=bus_owner)

        serializer = RouteModelSerializer(routes, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    



class RouteStopView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, route_id):
        route = RouteModel.objects.get(id=route_id)
        print('rout',route)
        
        stops = RouteStopModel.objects.filter(route=route).order_by('stop_order')
        
        serializer = RouteStopSerializer(stops, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request, route_id):
        try:
            route = RouteModel.objects.get(id=route_id)
        except RouteModel.DoesNotExist:
            return Response({"detail": "Route not found."}, status=status.HTTP_404_NOT_FOUND)

        stop_order = RouteStopModel.objects.filter(route=route).count() + 1
        
        data = request.data

        if RouteStopModel.objects.filter(route=route, stop_name=data.get("stop_name")).exists():
            return Response({"detail": "Stop name already exists for this route."}, status=status.HTTP_400_BAD_REQUEST)

        arrival_time = data.get("arrival_time")
        departure_time = data.get("departure_time")
        if arrival_time and departure_time:
            if arrival_time >= departure_time:
                return Response({"detail": "Departure time must be after arrival time."}, status=status.HTTP_400_BAD_REQUEST)

        distance_in_km = data.get("distance_in_km")
        if distance_in_km is not None:
            try:
                distance_in_km = float(distance_in_km)
            except ValueError:
                return Response({"detail": "Distance in kilometers must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

            if distance_in_km <= 0:
                return Response({"detail": "Distance in kilometers must be positive."}, status=status.HTTP_400_BAD_REQUEST)

            total_stop_distance = (
                RouteStopModel.objects.filter(route=route).aggregate(total_distance=models.Sum('distance_in_km'))['total_distance'] or Decimal(0)
            )

            distance_in_km = Decimal(str(distance_in_km))

            if total_stop_distance + distance_in_km > route.distance_in_km:
                return Response(
                    {"detail": "The total distance of stops cannot exceed the main route distance."},
                    status=status.HTTP_400_BAD_REQUEST
                )


        serializer = RouteStopSerializer(data=data)
        if serializer.is_valid():
            serializer.save(route=route, stop_order=stop_order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class BusTypeCreateView(APIView):

    def post(self, request):
        serializer = BusTypeSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Bus type added successfully!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        

    def get(self, request):
        print('getin woring')
        bus_types = BusType.objects.all()
        serializer = BusTypeSerializer(bus_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        




class BusListView(APIView):
    permission_classes = [IsAuthenticated]  
    authentication_classes = [JWTAuthentication] 


    def get(self, request):
        user = request.user   
        print('userrr-new',user)

        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
        except BusOwnerModel.DoesNotExist:
            return Response({'error': 'Bus owner not found for the current user.'}, status=status.HTTP_400_BAD_REQUEST)

        buses = BusModel.objects.filter(bus_owner=bus_owner)
        print('buses',buses)
        print('buse owner',bus_owner)

        serializer = BusModelSerializer2(buses, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class AddBusView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    

    def post(self, request):
        user = request.user

        try:
            bus_owner = BusOwnerModel.objects.get(user=user)   
        except BusOwnerModel.DoesNotExist:
            return Response({'error': 'User is not associated with a bus owner.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['bus_owner'] = bus_owner.id   

        serializer = BusModelSerializer(data=data,context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






