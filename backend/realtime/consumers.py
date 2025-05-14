from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import user_logged_in, user_logged_out
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token


class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = AnonymousUser()  # Until authenticated

    async def receive_json(self, content):
        if content.get("type") == "auth":
            token_key = content.get("token")
            try:
                token = await sync_to_async(Token.objects.select_related("user").get)(
                    key=token_key
                )
                self.user = token.user
                await sync_to_async(user_logged_in.send)(
                    sender=self.__class__,
                    request=None,
                    user=self.user,
                )

                await self.channel_layer.group_add(
                    f"user_{self.user.id}", self.channel_name
                )
                await self.send_json({"status": "authenticated"})
            except Token.DoesNotExist:
                await self.send_json({"error": "Invalid token"})
                await self.close()
        else:
            if self.user.is_authenticated:
                # Handle other messages here
                await self.send_json({"echo": content})
            else:
                await self.send_json({"error": "Not authenticated"})

    async def user_logged_in(self, event):
        await self.send_json(
            {
                "type": "friend_logged_in",
                "user_id": event["user_id"],
            }
        )

    async def disconnect(self, close_code):
        await sync_to_async(user_logged_out.send)(
            sender=self.__class__,
            request=None,
            user=self.user,
        )
        await self.channel_layer.group_discard(
            f"user_{self.user.id}", self.channel_name
        )
