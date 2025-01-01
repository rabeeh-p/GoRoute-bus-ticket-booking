from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
# Create your views here.

def hello(request):
    return HttpResponse("hello")

def get_bus_stations(request):
    data = [
        {"id": 1, "name": "Station 1"},
        {"id": 2, "name": "Station 2"},
        {"id": 3, "name": "Station 3"},
    ]
    return JsonResponse(data, safe=False)