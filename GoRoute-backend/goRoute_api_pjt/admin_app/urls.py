from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('',views.hello),
    # path('bus-stations/', views.get_bus_stations, name='get_bus_stations'),
    path('bus_owner/register/', UserAndBusOwnerRegisterView.as_view(), name='bus_owner_register'),
    path('login/', LoginView.as_view(), name='login'),


    path('register/', UserSignupView.as_view(), name='register'),
    path('otp/', OtpVerificationView.as_view(), name='otp'),
    

    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),

    # USERS
    path('user-profiles/', UserProfileListView.as_view(), name='user-profile-list'),
    path('profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user_profile_detail'),
    path('toggle-status/<int:user_id>/', ToggleUserStatusView.as_view(), name='toggle_user_status'),


    # BUS
    path('approved-bus-owners/', ApprovedBusOwnersView.as_view(), name='approved_bus_owners'),
    path('bus-owner-requests/', BusOwnerRequestListView.as_view(), name='bus-owner-requests'),
    path('bus-owner-details/<int:id>/', BusOwnerDetailView.as_view(), name='bus-owner-details'),
    path('accept-bus-owner/<int:id>/', AcceptBusOwnerView.as_view(), name='accept-bus-owner'),



    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]