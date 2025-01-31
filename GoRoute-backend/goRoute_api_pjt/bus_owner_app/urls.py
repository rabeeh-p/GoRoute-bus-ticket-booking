from django.urls import path
from .views import *
urlpatterns = [
    
    path('bus-owner-detail/', BusOwnerProfileView.as_view()),
    path('bus-owner/routes/', RouteCreateView.as_view(), name='create_route'),
    path('routes/my_routes/', RouteByOwnerView.as_view(), name='route-by-owner'),
    path('routes/my_routes/schedule-time/', RouteByOwnerViewInScheduleTime.as_view(), name='route-by-owner'),
    path('routes/<int:route_id>/stops/', RouteStopView.as_view(), name='route-stop-view'),
    path('routes/<int:route_id>/', SingleRouteView.as_view(), name='single-route'),

    path('bus-owner-details/<int:id>/edit/', BusOwnerUpdateView.as_view(), name='edit-bus-owner-profile'),

    path('api/bus/<int:bus_id>/seat-numbers/', BusSeatsAPIView.as_view(), name='bus_seat_numbers_api'),
    path('api/orders/<int:order_id>/details/', OrderDetailsView.as_view(), name='order-details'),


    path('add_bus_type/', BusTypeCreateView.as_view(), name='add_bus_type'),
    path('bus-list/', BusListView.as_view(), name='bus-list'),
    path('add-bus/', AddBusView.as_view(), name='add_bus'),
    path('api/bus/<int:bus_id>/', BusDetailView.as_view(), name='bus-detail'),
     


    # SCHEDULING
    path('schedule-bus/<int:bus_id>/', ScheduleBusView.as_view(), name='schedule-bus'),
    path('reschedule-bus/<int:bus_id>/', RestartScheduledBusView.as_view(), name='reschedule-bus'),

    path('busowner-dashboard/scheduled-buses/', ScheduledBusListView.as_view(), name='scheduled-buses-list'),
    path('busowner-dashboard/completed-buses/', CompletedBusListView.as_view(), name='completed-buses-list'),
    path('scheduled-buses/<int:busId>/', ScheduledBusDetailView.as_view(), name='scheduled-bus-detail'),

    # REGISTER CONDUCTOR
    path('register_conductor/', ConductorRegistrationAPIView.as_view(), name='register_conductor'),
    path('conductors/', BusOwnerConductorsAPIView.as_view(), name='bus-owner-conductors'),

    path('api/tickets/<int:ticket_id>/cancel/', CancelTicketView.as_view(), name='cancel_ticket'),
    path('owner-bus-tracking/<int:bus_id>/', BusOwnerTrackingAPIView.as_view(), name='owner-bus-tracking'),

    path('api/orders/', OrderStatsView.as_view(), name='order-stats'),
]
