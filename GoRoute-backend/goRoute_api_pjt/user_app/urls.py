from django.urls import path
from .views import *
urlpatterns = [
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('google-login/', GoogleLoginAPIView.as_view(), name='google-login'),


    path('search_buses/', BusSearchView.as_view(), name='search_buses'),
    path('bus-details/<int:bus_id>/', BusSeatDetailsView.as_view(), name='bus-seat-details'),
    path('seat-booking/', SeatBookingView.as_view(), name='seat-booking'),
]
