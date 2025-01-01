from django.urls import path
from . import views

urlpatterns = [
    path('',views.hello),
    path('bus-stations/', views.get_bus_stations, name='get_bus_stations'),
]