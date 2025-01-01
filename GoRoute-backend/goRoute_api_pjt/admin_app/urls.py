from django.urls import path
from .views import *

urlpatterns = [
    # path('',views.hello),
    # path('bus-stations/', views.get_bus_stations, name='get_bus_stations'),
    path('bus_owner/register/', UserAndBusOwnerRegisterView.as_view(), name='bus_owner_register'),
]