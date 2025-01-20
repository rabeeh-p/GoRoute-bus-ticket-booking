from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path('ws/seats/<int:bus_id>/', SeatConsumer.as_asgi()),  
   
]
