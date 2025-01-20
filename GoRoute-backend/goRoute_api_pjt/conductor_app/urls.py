from django.urls import path
from .views import *
urlpatterns = [
    path('api/conductor/login/', ConductorLoginView.as_view(), name='conductor-login'),
    path('conductor-dashboard/', ConductorDashboardView.as_view(), name='conductor-dashboard'),
    path('update-stop/', UpdateCurrentStop.as_view(), name='update_current_stop'),




]
