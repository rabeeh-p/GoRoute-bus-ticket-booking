

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get room_name and user_type from the URL
        print('consumers working')
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.user_type = self.scope['url_route']['kwargs']['user_type']

        # Create the group name (based on room_name)
        self.room_group_name = f'chat_{self.room_name}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send the message to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))








