from django.urls import path
from .views import *
urlpatterns = [
    path('api/conductor/login/', ConductorLoginView.as_view(), name='conductor-login'),
    path('conductor-dashboard/', ConductorDashboardView.as_view(), name='conductor-dashboard'),
    path('update-stop/', UpdateCurrentStop.as_view(), name='update_current_stop'),
    path('api/start-journey', StartJourneyView.as_view(), name='start-journey'),

    path('api/forgot-password-check/', ForgotPasswordCheckView.as_view(), name='forgot_password_check'),
    path('api/forgot-password-update/', ForgotPasswordUpdateView.as_view(), name='forgot_password_update'),





]
