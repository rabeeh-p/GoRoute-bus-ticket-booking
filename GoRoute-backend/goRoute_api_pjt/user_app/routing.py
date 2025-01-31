from django.urls import re_path
from .consumers import ChatConsumer
from django.urls import path


websocket_urlpatterns = [
   
    
    path("ws/<str:roomId2>/", ChatConsumer.as_asgi()),  
     
     

]
