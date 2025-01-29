

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async

from .serializers import MessageSerializer
from admin_app.models import *

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

        # Send previous messages to the user
        chat_room = ChatRoom.objects.get(room_id=self.room_id)
        messages = Message.objects.filter(room=chat_room).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        await self.send(text_data=json.dumps({
            'messages': serializer.data
        }))

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive a message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_text = text_data_json['message']

        # Create a new message in the database
        chat_room = ChatRoom.objects.get(room_id=self.room_id)
        user = self.scope['user']  # Get the user from the scope
        message = Message.objects.create(room=chat_room, user=user, message=message_text)

        # Send the message to the room group
        serializer = MessageSerializer(message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serializer.data
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


