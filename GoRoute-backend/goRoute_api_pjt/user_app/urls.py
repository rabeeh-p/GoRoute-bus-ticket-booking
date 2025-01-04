from django.urls import path
from .views import *
urlpatterns = [
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('google-login/', GoogleLoginAPIView.as_view(), name='google-login'),
]
