from django.urls import path
from .views import *
urlpatterns = [
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user-profile/edit/', UserProfileEditView.as_view(), name='user-profile-edit'),

    path('google-login/', GoogleLoginAPIView.as_view(), name='google-login'),






    # BOOKING AND SEARCH
    path('all-stops/', AllStopsView.as_view(), name='all-stops'),

    path('search_buses/', BusSearchView.as_view(), name='search_buses'),
    path('bus-details/<int:bus_id>/', BusSeatDetailsView.as_view(), name='bus-seat-details'),

    path('seat-booking/', SeatBookingView.as_view(), name='seat-booking'),
    # path('verify-payment/', PaymentVerificationView.as_view(), name='verify-payment'),
    path('payment-success/', PaymentSuccessAPIView.as_view(), name='verify-payment'),

    
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:order_id>/tickets/', TicketListView.as_view(), name='ticket-list'),


    path('api/wallet/', WalletAPIView.as_view(), name='wallet-api'),
    path('cancel-ticket/<int:ticket_id>/', CancelTicketAPIView.as_view(), name='cancel_ticket'),
    


    path('bus-tracking/<int:bus_id>/', BusTrackingAPIView.as_view(), name='bus_tracking'),



]
