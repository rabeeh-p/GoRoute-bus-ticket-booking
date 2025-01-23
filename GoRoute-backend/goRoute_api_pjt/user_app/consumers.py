import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SeatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connected")  
        await self.accept()

    async def disconnect(self, close_code):
        print("WebSocket disconnected")   
    
    async def receive(self, text_data):
        print(f"Received message: {text_data}")
        try:
            data = json.loads(text_data)  
            message = data.get('message', 'Hello from Django WebSocket!')
            print(f"Sending message back: {message}")  
            await self.send(text_data=json.dumps({'message': message}))   
        except json.JSONDecodeError:
            print("Error: Received invalid JSON data.")






# from asgiref.sync import async_to_sync

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class SeatBookingConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.bus_id = self.scope['url_route']['kwargs']['bus_id']
#         self.group_name = f"bus_{self.bus_id}_seats"

#         # Join the WebSocket group
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Leave the WebSocket group
#         await self.channel_layer.group_discard(
#             self.group_name,
#             self.channel_name
#         )

#     # Receive message from WebSocket
#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         seat_number = text_data_json['seat_number']
#         status = text_data_json['status']

#         # Send message to WebSocket group
#         await self.send(text_data=json.dumps({
#             'seat_number': seat_number,
#             'status': status
#         }))

#     # Receive message from group
#     async def seat_update(self, event):
#         seat_number = event['seat_number']
#         status = event['status']

#         # Send seat update to WebSocket
#         await self.send(text_data=json.dumps({
#             'seat_number': seat_number,
#             'status': status
#         }))
