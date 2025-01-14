from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from admin_app.serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from decimal import Decimal

from django.shortcuts import get_object_or_404
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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
            # 'start_datetime': data.get('startDatetime'),
            
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

    # def get(self, request):
    #     user = request.user
    #     try:
    #         bus_owner = BusOwnerModel.objects.get(user=user)
    #     except BusOwnerModel.DoesNotExist:
    #         return Response(
    #             {"error": "Bus owner does not exist for the authenticated user."},
    #             status=status.HTTP_404_NOT_FOUND
    #         )

    #     routes = RouteModel.objects.filter(bus_owner=bus_owner)

    #     serializer = RouteModelSerializer(routes, many=True)

    #     return Response(serializer.data, status=status.HTTP_200_OK)
    

    def get(self, request):
        user = request.user
        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
        except BusOwnerModel.DoesNotExist:
            return Response(
                {"error": "Bus owner does not exist for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Fetch routes for the bus owner that have at least one stop
        routes = RouteModel.objects.filter(bus_owner=bus_owner).filter(stops__isnull=False).distinct()

        # Serialize the filtered routes
        serializer = RouteModelSerializer(routes, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


    


class SingleRouteView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self, route_id, user):
        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
            return RouteModel.objects.get(id=route_id, bus_owner=bus_owner)
        except BusOwnerModel.DoesNotExist:
            return None
        except RouteModel.DoesNotExist:
            return None

    def get(self, request, route_id):
        route = self.get_object(route_id, request.user)
        if not route:
            return Response(
                {"error": "Route not found or you do not have permission to access it."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = RouteModelSerializer(route)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    def put(self, request, route_id):
        route = self.get_object(route_id, request.user)
        print("PUT is working")
        if not route:
            return Response(
                {"error": "Route not found or you do not have permission to edit it."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        print("Route instance:", route)
        print("Request data:", request.data)
        
        serializer = RouteModelSerializer(route, data=request.data, partial=True)
        if serializer.is_valid():
            print("Serializer is valid. Updating route.")
            serializer.save()
            print("Route updated:", serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RouteStopView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, route_id):
        route = RouteModel.objects.get(id=route_id)
        print('rout11',route)
        
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
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

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






# ------------------------------------- scheduling bu--------------------




class ScheduleBusView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, bus_id):
        try:
            bus = BusModel.objects.get(id=bus_id)

            route_id = request.data.get('route_id')
            if not route_id:
                return Response({"error": "route_id is required"}, status=status.HTTP_400_BAD_REQUEST)

            route = RouteModel.objects.get(id=route_id)

            stops = RouteStopModel.objects.filter(route_id=route_id).order_by('stop_order')
            if not stops.exists():
                return Response({"error": "No stops found for the provided route"}, status=status.HTTP_404_NOT_FOUND)

            scheduled_date = request.data.get('scheduled_date')
            if not scheduled_date:
                return Response({"error": "scheduled_date is required"}, status=status.HTTP_400_BAD_REQUEST)

            scheduled_bus = ScheduledBus.objects.create(
                bus_number=bus.bus_number,
                name=bus.name,
                bus_owner_name=bus.bus_owner.travel_name,  
                bus_type=bus.bus_type.name,   
                seat_type=bus.bus_type.seat_type,  
                seat_count=bus.bus_type.seat_count,   
                route=route.route_name,   
                scheduled_date=scheduled_date,
                description=bus.description,
                started=False,
            )

            for stop in stops:
                ScheduledStop.objects.create(
                    scheduled_bus=scheduled_bus,
                    stop_name=stop.stop_name,
                    stop_order=stop.stop_order,
                    arrival_time=stop.arrival_time,
                    departure_time=stop.departure_time,
                    distance_km=stop.distance_in_km
                )

            bus.Scheduled = True
            bus.save()

            return Response({
                "message": "Bus scheduled successfully",
                "scheduled_bus_id": scheduled_bus.id,
            }, status=status.HTTP_201_CREATED)

        except BusModel.DoesNotExist:
            return Response({"error": "Bus not found"}, status=status.HTTP_404_NOT_FOUND)
        except RouteModel.DoesNotExist:
            return Response({"error": "Route not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)






class ScheduledBusListView(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            bus_owner = BusOwnerModel.objects.get(user=request.user)
        except BusOwnerModel.DoesNotExist:
            return Response({"detail": "Bus Owner profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
        travel_name = bus_owner.travel_name   
        print(travel_name, 'Travel Name')

        buses = ScheduledBus.objects.filter(bus_owner_name=travel_name, status='active')
        print(buses,'buses')

        if not buses.exists():
            return Response({"detail": "No active buses found for this bus owner."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduledBusSerializer(buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ScheduledBusDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def get(self, request, busId):
        try:
            print(busId,'bus idddd11')
            scheduled_bus = ScheduledBus.objects.get(id=busId)
            print(scheduled_bus,'scheduled bus')

            serializer = ScheduledBusSerializer(scheduled_bus)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ScheduledBus.DoesNotExist:
            return Response(
                {"detail": "Scheduled Bus not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        



class BusDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request, bus_id, format=None):
        try:
            print('is woring')
            bus = BusModel.objects.get(id=bus_id)
            serializer = BusModelSerializer2(bus)
            return Response(serializer.data)
        except BusModel.DoesNotExist:
            return Response({"error": "Bus not found"}, status=status.HTTP_404_NOT_FOUND)
        
    
    def delete(self, request, bus_id, format=None):
        try:
            bus = BusModel.objects.get(id=bus_id)
            bus.delete()   
            return Response({"message": "Bus deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except BusModel.DoesNotExist:
            return Response({"error": "Bus not found"}, status=status.HTTP_404_NOT_FOUND)







class BusSeatsAPIView(APIView):
   

    def get(self, request, bus_id):
        bus = get_object_or_404(ScheduledBus, id=bus_id)

        tickets = Ticket.objects.filter(seat__bus=bus)

        booked_seats = []
        for ticket in tickets:
            order = ticket.order
            user = order.user   

            seat_data = {
                'seat_number': ticket.seat.seat_number,
            }
            user_data = NormalUserProfileSerializer(user).data   
            booked_seats.append({
                'seat': seat_data,
                'user': user_data
            })

        return Response({"booked_seats": booked_seats}, status=status.HTTP_200_OK)
