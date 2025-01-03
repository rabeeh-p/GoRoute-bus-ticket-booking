from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from admin_app.models import *
from admin_app.serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.



class BusOwnerProfileView(APIView):
    permission_classes = [IsAuthenticated]   
    authentication_classes = [JWTAuthentication]  

    def get(self, request, *args, **kwargs):
        try:
            bus_owner = BusOwnerModel.objects.get(user=request.user)
            
            serializer = BusOwnerSerializer(bus_owner)
            return Response(serializer.data)
        except BusOwnerModel.DoesNotExist:
            return Response({"error": "Bus owner profile not found."}, status=404)