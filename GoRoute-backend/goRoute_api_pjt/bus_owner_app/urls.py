from django.urls import path
from .views import *
urlpatterns = [
    # path('', )
    path('bus-owner-detail/', BusOwnerProfileView.as_view()),
]
