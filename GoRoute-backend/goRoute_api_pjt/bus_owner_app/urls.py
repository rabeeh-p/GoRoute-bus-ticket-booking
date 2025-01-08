from django.urls import path
from .views import *
urlpatterns = [
    # path('', )
    path('bus-owner-detail/', BusOwnerProfileView.as_view()),
    path('bus-owner/routes/', RouteCreateView.as_view(), name='create_route'),
    path('routes/my_routes/', RouteByOwnerView.as_view(), name='route-by-owner'),
    path('routes/<int:route_id>/stops/', RouteStopView.as_view(), name='route-stop-view'),


    path('add_bus_type/', BusTypeCreateView.as_view(), name='add_bus_type'),
    # path('add-bus/', AddBusView.as_view(), name='add-bus'),
    path('bus-list/', BusListView.as_view(), name='bus-list'),
    path('add-bus/', AddBusView.as_view(), name='add_bus'),
]
