from django.urls import re_path
from .consumers import ChatConsumer
from django.urls import path


websocket_urlpatterns = [
   
    # re_path(r"^ws/(?P<roomId>[a-f0-9-]+)/$", ChatConsumer.as_asgi()),
    path("ws/<str:roomId2>/", ChatConsumer.as_asgi()),  
     
    # re_path(r"^ws/hello/$", ChatConsumer.as_asgi()),

]
