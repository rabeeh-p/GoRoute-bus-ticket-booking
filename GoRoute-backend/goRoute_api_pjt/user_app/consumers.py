

from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime

from .serializers import MessageSerializer
from admin_app.models import *
from django.contrib.auth import get_user_model
# User = get_user_model()
from channels.db import database_sync_to_async

# class ChatConsumer(AsyncWebsocketConsumer):
   

#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         print(f"Connecting to room: {self.room_name}")  # Debug log
#         self.room_group_name = f'chat_{self.room_name}'

#     async def disconnect(self, close_code):
#         # Leave the room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         # Send message to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']

#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))




# class ChatConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['roomId2']
#         self.room_group_name = f'chat_{self.room_name}'

#         # Try to get the chat room from the database
#         try:
#             self.chat_room = await database_sync_to_async(ChatRoom.objects.get)(room_id=self.room_name)
#             print(f"Chat room found: {self.chat_room.name}")  # Debug log
#         except ChatRoom.DoesNotExist:
#             self.chat_room = None
#             print(f"Chat room not found for room_id: {self.room_name}")  # Debug log

#         if self.chat_room:
#             # Join the room group
#             await self.channel_layer.group_add(
#                 self.room_group_name,
#                 self.channel_name
#             )
#             await self.accept()

#     async def disconnect(self, close_code):
#         # Leave the room group if chat_room is found
#         if self.chat_room:
#             await self.channel_layer.group_discard(
#                 self.room_group_name,
#                 self.channel_name
#             )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message_content = text_data_json['message']
#         user_id = text_data_json.get('user_id')
#         print(user_id)

#         try:
#             # Get the user sending the message
#             user = await database_sync_to_async(CustomUser.objects.get)(id=user_id)
#             print(f"User found: {user.username}")  # Debug log
#         except CustomUser.DoesNotExist:
#             user = None
#             print(f"User with ID {user_id} does not exist")  # Debug log

#         if user and self.chat_room:
#             # Check if the user is a conductor (only conductors can send messages)
#             if user.role != 'conductor':
#                 print(f"User {user.username} is not a conductor, cannot send message")  # Debug log
#                 return  # Do nothing if user is not a conductor

#             # Save the message to the database
#             await self.save_message(user, message_content)

#             # Send the message to the room group
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': message_content,
#                     'user': user.username  # You can send the username or any other user details
#                 }
#             )

#     async def chat_message(self, event):
#         message = event['message']
#         user = event['user']

#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'user': user  # Include the sender's username in the response
#         }))

#     @database_sync_to_async
#     def save_message(self, user, message_content):
#         # Debug log to confirm message content before saving
#         print(f"Saving message: {message_content} from user {user.username} to room {self.chat_room.name}")  # Debug log

#         # Save the message to the database
#         if not message_content:
#             raise ValueError("Message content cannot be empty!")
#         message = Message.objects.create(user=user, room=self.chat_room, message=message_content)
#         return message



class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['roomId2']
        self.room_group_name = f'chat_{self.room_name}'

        # Try to get the chat room from the database
        try:
            self.chat_room = await database_sync_to_async(ChatRoom.objects.get)(room_id=self.room_name)
            print(f"Chat room found: {self.chat_room.name}")  # Debug log
        except ChatRoom.DoesNotExist:
            self.chat_room = None
            print(f"Chat room not found for room_id: {self.room_name}")  # Debug log

        if self.chat_room:
            # Join the room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group if chat_room is found
        if self.chat_room:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        user_id = text_data_json.get('user_id')
        print(user_id)

        try:
            # Get the user sending the message
            user = await database_sync_to_async(CustomUser.objects.get)(id=user_id)
            print(f"User found: {user.username}")  # Debug log
        except CustomUser.DoesNotExist:
            user = None
            print(f"User with ID {user_id} does not exist")  # Debug log

        if user and self.chat_room:
            # Save the message to the database
            await self.save_message(user, message_content)

            # Send the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'user': user.username  # You can send the username or any other user details
                }
            )

    async def chat_message(self, event):
        message = event['message']
        user = event['user']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user  # Include the sender's username in the response
        }))

    @database_sync_to_async
    def save_message(self, user, message_content):
        # Debug log to confirm message content before saving
        print(f"Saving message: {message_content} from user {user.username} to room {self.chat_room.name}")  # Debug log

        # Save the message to the database
        if not message_content:
            raise ValueError("Message content cannot be empty!")
        message = Message.objects.create(user=user, room=self.chat_room, message=message_content)
        return message














