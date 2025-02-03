

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime

from .serializers import MessageSerializer
from admin_app.models import *
from django.contrib.auth import get_user_model
# User = get_user_model()
from channels.db import database_sync_to_async



class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomId2']
        self.room_group_name = f'chat_{self.room_name}'

         
        try:
            self.chat_room = await database_sync_to_async(ChatRoom.objects.get)(room_id=self.room_name)
            print(f"Chat room found: {self.chat_room.name}")   
        except ChatRoom.DoesNotExist:
            self.chat_room = None
            print(f"Chat room not found for room_id: {self.room_name}")   

        if self.chat_room:
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        if self.chat_room:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        user_id = text_data_json.get('user_id')
        timestamp = text_data_json.get('timestamp')
        print(user_id)

        try:
            user = await database_sync_to_async(CustomUser.objects.get)(id=user_id)
            print(f"User found: {user.username}")   
        except CustomUser.DoesNotExist:
            user = None
            print(f"User with ID {user_id} does not exist")  
        if user and self.chat_room:
            await self.save_message(user, message_content,timestamp)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'user': user.username   ,
                    'timestamp': timestamp
                }
            )

    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        timestamp = event.get('timestamp')

        await self.send(text_data=json.dumps({
            'message': message,
            'user': user   ,
            'timestamp': timestamp 
        }))

    @database_sync_to_async
    def save_message(self, user, message_content,timestamp):
        print(f"Saving message: {message_content} from user {user.username} to room {self.chat_room.name}")  # Debug log

        if not message_content:
            raise ValueError("Message content cannot be empty!")
        message = Message.objects.create(user=user, room=self.chat_room, message=message_content,timestamp=timestamp)
        return message














