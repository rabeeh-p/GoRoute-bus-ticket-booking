from django.urls import path
from .views import *
urlpatterns = [
    # path('', )
    path('bus-owner-detail/', BusOwnerProfileView.as_view()),
    path('bus-owner/routes/', RouteCreateView.as_view(), name='create_route'),
    path('routes/my_routes/', RouteByOwnerView.as_view(), name='route-by-owner'),
]
