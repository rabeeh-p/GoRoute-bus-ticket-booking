from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(CustomUser)
admin.site.register(BusOwnerModel)
admin.site.register(NormalUserProfile)
admin.site.register(OTP)
admin.site.register(RouteModel)
admin.site.register(RouteStopModel)
admin.site.register(BusType)
admin.site.register(BusModel)
admin.site.register(ScheduledBus)
admin.site.register(ScheduledStop)



admin.site.register(Seat)
admin.site.register(Order)
admin.site.register(Ticket)

admin.site.register(Wallet)
admin.site.register(Transaction)
admin.site.register(StopStatusUpdate)

admin.site.register(Conductor)
admin.site.register(ConductorScheduledBus)
admin.site.register(Message)

admin.site.register(ChatRoom)













