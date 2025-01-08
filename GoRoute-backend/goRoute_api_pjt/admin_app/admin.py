from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(CustomUser)
admin.site.register(BusOwnerModel)
admin.site.register(NormalUserProfile)
admin.site.register(OTP)
admin.site.register(RouteModel)
admin.site.register(RouteStopModel)

