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



    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]