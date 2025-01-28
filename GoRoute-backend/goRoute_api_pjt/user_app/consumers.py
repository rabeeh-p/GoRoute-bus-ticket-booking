# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class SeatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         print("WebSocket connected")  
#         await self.accept()

#     async def disconnect(self, close_code):
#         print("WebSocket disconnected")   
    
#     async def receive(self, text_data):
#         print(f"Received message: {text_data}")
#         try:
#             data = json.loads(text_data)  
#             message = data.get('message', 'Hello from Django WebSocket!')
#             print(f"Sending message back: {message}")  
#             await self.send(text_data=json.dumps({'message': message}))   
#         except json.JSONDecodeError:
#             print("Error: Received invalid JSON data.")

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get room_name from the URL route
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive a message from WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))
