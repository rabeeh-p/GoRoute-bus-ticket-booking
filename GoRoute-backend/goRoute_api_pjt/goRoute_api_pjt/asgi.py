"""
ASGI config for goRoute_api_pjt project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'goRoute_api_pjt.settings')

# application = get_asgi_application()


# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter   
# from channels.auth import AuthMiddlewareStack
# from user_app.routing import websocket_urlpatterns   

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'goRoute_api_pjt.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(websocket_urlpatterns)   
#     ),
# })









import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from django.urls import re_path
from user_app.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'goRoute_api_pjt.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
           
            # re_path(r'ws/chat/(?P<room_id>\w+)/$', ChatConsumer.as_asgi()),
            # path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
            # re_path(r'ws/chat/(?P<room_id>\w+)/$', ChatConsumer.as_asgi()),
            # re_path(r'ws/chat/(?P<room_id>[a-f0-9-]+)/$', ChatConsumer.as_asgi()),
            path('ws/chat/<room_id>/', ChatConsumer.as_asgi())
        ])
    ),
})















