from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    
    path('bus_owner/register/', UserAndBusOwnerRegisterView.as_view(), name='bus_owner_register'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin-create-user/', CreateUserByAdmin.as_view(), name='admin-create-user'),

    # REGISTRATION
    path('register/', UserSignupView.as_view(), name='register'),
    path('otp/', OtpVerificationView.as_view(), name='otp'),
    

    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # USERS
    path('user-profiles/', UserProfileListView.as_view(), name='user-profile-list'),
    path('profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user_profile_detail'),
    path('toggle-status/<int:user_id>/', ToggleUserStatusView.as_view(), name='toggle_user_status'),


    # BUS
    path('approved-bus-owners/', ApprovedBusOwnersView.as_view(), name='approved_bus_owners'),
    path('bus-owner-requests/', BusOwnerRequestListView.as_view(), name='bus-owner-requests'),
    path('bus-owner-details/<int:id>/', BusOwnerDetailView.as_view(), name='bus-owner-details'),
    path('accept-bus-owner/<int:id>/', AcceptBusOwnerView.as_view(), name='accept-bus-owner'),
    path('busowner-dashboard/scheduled-buses-adminOnly/', AdminScheduledBusListView.as_view(), name='admin-scheduled-buses'),
    path('scheduled-bus-data/', ScheduledBusDataView.as_view(), name='scheduled-bus-data'),


    # REQUESTS
    path('buses/pending/', PendingBusesView.as_view(), name='pending-buses'),
    path('buses/<int:pk>/', BusDetailsView.as_view(), name='bus-details'),
    path('bus-requests/<int:bus_id>/approve/', ApproveBusRequestView.as_view(), name='approve_bus_request'),
    path('bus-requests/<int:bus_id>/reject/', RejectBusRequestView.as_view(), name='reject_bus_request'),




    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]