from django.urls import path
from django.urls import re_path
from .consumers import *

websocket_urlpatterns = [
    path('ws/seats/<int:bus_id>/', SeatConsumer.as_asgi()),  
    # re_path(r'ws/bus/(?P<bus_id>\d+)/$', SeatBookingConsumer.as_asgi()),
    # re_path(r'ws/seats/(?P<bus_id>\d+)/$', SeatBookingConsumer.as_asgi()),
]
