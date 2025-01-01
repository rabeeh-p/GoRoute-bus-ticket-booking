from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('',views.hello),
    # path('bus-stations/', views.get_bus_stations, name='get_bus_stations'),
    path('bus_owner/register/', UserAndBusOwnerRegisterView.as_view(), name='bus_owner_register'),
    path('login/', LoginView.as_view(), name='login'),



    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),



    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]