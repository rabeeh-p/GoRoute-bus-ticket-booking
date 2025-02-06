from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from admin_app.serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from decimal import Decimal
from datetime import datetime

from django.shortcuts import get_object_or_404
from .Serializers import *

from collections import defaultdict
from django.db import transaction
from django.http import JsonResponse
from rest_framework.exceptions import NotFound

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
        

class BusOwnerUpdateView(APIView):

    def get_object(self, id):
        try:
            return BusOwnerModel.objects.get(user=id)
        except BusOwnerModel.DoesNotExist:
            return None

    

    def patch(self, request, id, *args, **kwargs):
        """ Handle the PATCH request for updating bus owner details """
        owner = self.get_object(id)
        if not owner:
            return Response({"detail": "Bus owner not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        if 'logo_image' in request.FILES:
            data['logo_image'] = request.FILES['logo_image']

        serializer = BusOwnerSerializerProfileUpdate(owner, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print('err', serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






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
    

    

class RouteByOwnerViewInScheduleTime(APIView):
    def get(self, request):
        user = request.user
        print(user,'user')
        try:
            bus_owner = BusOwnerModel.objects.get(user=user)
        except BusOwnerModel.DoesNotExist:
            return Response(
                {"error": "Bus owner does not exist for the authenticated user."},
                status=status.HTTP_404_NOT_FOUND
            )

        routes = RouteModel.objects.filter(bus_owner=bus_owner).filter(stops__isnull=False).distinct()

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
            try:
                scheduled_date = datetime.fromisoformat(scheduled_date).date()

                if scheduled_date <= datetime.now().date():
                    return Response({"error": "Scheduled date must be in the future"}, status=status.HTTP_400_BAD_REQUEST)

            except ValueError:
                return Response({"error": "Invalid date format. Please use a valid ISO 8601 format (e.g., YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

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
                bus_owner_id=bus.bus_owner.user.id,
                current_stop=stops.first().stop_name,   
                stop_number=stops.first().stop_order-1,
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

            conductor_id = request.data.get('conductor_id')   
            if conductor_id:
                try:
                    conductor = Conductor.objects.get(id=conductor_id)
                    conductor.is_active=True
                    conductor.save()
                    ConductorScheduledBus.objects.create(
                        conductor=conductor,
                        scheduled_bus=scheduled_bus
                    )
                except Conductor.DoesNotExist:
                    return Response({"error": f"Conductor with ID {conductor_id} not found"}, status=status.HTTP_404_NOT_FOUND)

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






class RestartScheduledBusView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, bus_id):
        try:
            print('restart is working')
            scheduled_bus = ScheduledBus.objects.get(id=bus_id)
            print(scheduled_bus,'bus')

             

            conductor_id = request.data.get('conductor_id')
            scheduled_date = request.data.get('scheduled_date')

             
            if not scheduled_date:
                return Response({"error": "New schedule date is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                scheduled_date = datetime.fromisoformat(scheduled_date).date()

                if scheduled_date <= datetime.now().date():
                    return Response({"error": "Scheduled date must be in the future"}, status=status.HTTP_400_BAD_REQUEST)

            except ValueError:
                return Response({"error": "Invalid date format. Please use a valid ISO 8601 format (e.g., YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)

             
            scheduled_bus.started = False
            scheduled_bus.current_stop = None
            scheduled_bus.stop_number = 0
            scheduled_bus.scheduled_date = scheduled_date
            scheduled_bus.save()

             
            if conductor_id:
                try:
                    conductor = Conductor.objects.get(id=conductor_id)
                    conductor.is_active = True
                    conductor.save()
                    ConductorScheduledBus.objects.create(conductor=conductor, scheduled_bus=scheduled_bus)
                except Conductor.DoesNotExist:
                    return Response({"error": f"Conductor with ID {conductor_id} not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "message": "Bus restarted successfully",
                "scheduled_bus_id": scheduled_bus.id,
            }, status=status.HTTP_200_OK)

        except ScheduledBus.DoesNotExist:
            return Response({"error": "Scheduled bus not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)









class CompletedBusListView(APIView):
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
        completed_buses = ScheduledBus.objects.filter(bus_owner_name=travel_name, status='completed')

        if not completed_buses.exists():
            return Response({"detail": "No completed buses found for this bus owner."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduledBusSerializer(completed_buses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)






class ScheduledBusListView(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # obj = CustomUser.objects.get(id=44)
        # print('objjj',obj)
        
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
        print(bus,'bus')

        orders = Order.objects.filter(bus=bus)

        booked_seats = []
        
        for order in orders:
            seats = []
            tickets = Ticket.objects.filter(order=order,seat__status='booked')

            for ticket in tickets:
                seat_data = {
                    'seat_number': ticket.seat.seat_number,
                }
                seats.append(seat_data)

            order_data = OrderSerializer(order).data

            booked_seats.append({
                'order': order_data,
                'seats': seats
            })

        return Response({"booked_seats": booked_seats}, status=status.HTTP_200_OK)

class OrderDetailsView(APIView):
    def get(self, request, order_id):
        print('order id is working')
        order = get_object_or_404(Order, id=order_id)

        tickets = Ticket.objects.filter(order=order)

        order_data = OrderSerializer(order).data
        tickets_data = TicketSerializer(tickets, many=True).data

        return Response({
            "order": order_data,
            "tickets": tickets_data
        }, status=status.HTTP_200_OK)
    







class ConductorRegistrationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not hasattr(request.user, 'bus_owner'):
            return Response(
                {"error": "Only bus owners can register conductors."},
                status=status.HTTP_403_FORBIDDEN
            )

        bus_owner_profile = request.user.bus_owner

        username = request.data.get('username')
        license_number = request.data.get('license_number')

        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {"error": "A conductor with this username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Conductor.objects.filter(license_number=license_number).exists():
            return Response(
                {"error": "A conductor with this license number already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ConductorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(travels=bus_owner_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BusOwnerConductorsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not hasattr(request.user, 'bus_owner'):
            return Response(
                {"error": "Only bus owners can view conductors."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        bus_owner_profile = request.user.bus_owner
        print(bus_owner_profile,'prifile')
        conductors = Conductor.objects.filter(travels=bus_owner_profile)

        serializer = ConductorSerializer(conductors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)










class CancelTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ticket_id):
        print('Cancel is working')

        with transaction.atomic():
            try:
                ticket = Ticket.objects.get(id=ticket_id)

                if ticket.status == 'cancelled':
                    return Response({"error": "This ticket has already been cancelled."}, status=status.HTTP_400_BAD_REQUEST)

                order = ticket.order

                if order.status != 'confirmed':
                    return Response({"error": "Only confirmed orders can be cancelled."}, status=status.HTTP_400_BAD_REQUEST)

                print('Refund process started')
                try:
                    user = order.user.user  
                    print(f'User: {user.username}')

                    user_wallet = Wallet.objects.get(user=user)
                    print(f'User Wallet: {user_wallet}, Current Balance: {user_wallet.balance}')

                    user_wallet.balance += ticket.amount
                    user_wallet.save()

                    print(f'Updated User Wallet: {user_wallet}, New Balance: {user_wallet.balance}')
                except Wallet.DoesNotExist:
                    print('Wallet not found for the user')
                    return Response({"error": "Wallet not found for the user."}, status=status.HTTP_400_BAD_REQUEST)

                scheduled_bus = order.bus  
                bus_owner_id = scheduled_bus.bus_owner_id

                if not bus_owner_id:
                    return Response({"error": "Bus owner ID not found."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    bus_owner = CustomUser.objects.get(id=bus_owner_id)

                    bus_owner_wallet = Wallet.objects.get(user=bus_owner)
                    print(f'Bus Owner Wallet: {bus_owner_wallet}, Current Balance: {bus_owner_wallet.balance}')

                    bus_owner_wallet.balance -= ticket.amount
                    bus_owner_wallet.save()

                    Transaction.objects.create(
                        wallet=bus_owner_wallet,
                        amount=ticket.amount,
                        transaction_type='debit',
                        description=f"Ticket cancellation refund (Ticket ID: {ticket.id})"
                    )
                except CustomUser.DoesNotExist:
                    return Response({"error": "Bus owner not found."}, status=status.HTTP_404_NOT_FOUND)
                except Wallet.DoesNotExist:
                    return Response({"error": "Wallet not found for the bus owner."}, status=status.HTTP_400_BAD_REQUEST)

                Transaction.objects.create(
                    wallet=user_wallet,
                    amount=ticket.amount,
                    transaction_type='credit',
                    description=f"Refund for cancelled ticket (Ticket ID: {ticket.id})"
                )

                ticket.status = 'cancelled'
                ticket.save()

                seat = ticket.seat
                # seat.status = 'available'
                # seat.save()
                seat.delete()

                if all(ticket.status == 'cancelled' for ticket in order.seats.all()):
                    order.status = 'cancelled'
                    order.save()

                return Response({"message": "Ticket cancelled successfully, refund processed."}, status=status.HTTP_200_OK)

            except Ticket.DoesNotExist:
                return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)





class BusOwnerTrackingAPIView(APIView):
    def get(self, request, bus_id):
        try:
            print('Bus owner tracking view is working')

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

            owner_info = {
                "is_owner": True,   
                "bus_status": scheduled_bus.status,   
            }

            response_data = {
                "bus": bus_data,
                "current_stop": current_stop_serialized,
                "next_stops": next_stops_serialized,
                "total_stops": total_stops_serialized,
                "owner_info": owner_info,   
            }

            return Response(response_data)

        except ScheduledBus.DoesNotExist:
            raise NotFound("Bus not found")

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)




class OrderStatsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        current_bus_owner_id = request.user.id
        
        owned_buses = ScheduledBus.objects.filter(bus_owner_id=current_bus_owner_id)
        
        orders = Order.objects.filter(bus__in=owned_buses)
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)











