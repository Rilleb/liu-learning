from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import user_logged_in, user_logged_out
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

from realtime import utils
from realtime.utils import notify_inviter_on_response, notify_user_on_invite


class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = AnonymousUser()  # Until authenticated

    async def receive_json(self, content):
        print(content)
        type = content.get("type")
        if type == "auth":
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
        elif type == "invite_user":
            friend = content.get("user_id")
            await notify_user_on_invite(friend, self.user)
        elif type == "game_invite_accepted":
            invite_from = content.get("invite_came_from")
            await notify_inviter_on_response(
                invite_from, self.user, True, content.get("game_id")
            )
        elif type == "game_invite_declined":
            invite_from = content.get("invite_came_from")
            await notify_inviter_on_response(invite_from, self.user, False)
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

    async def game_invite_answered(self, event):
        await self.send_json(
            {
                "type": "game_invite_answered",
                "accepted": event["accepted"],
                "username": event["username"],
                "game_id": event["game_id"],
            }
        )

    async def game_invite_received(self, event):
        game_id = utils.create_new_game_id()
        if not game_id:
            return None
        await self.send_json(
            {
                "type": "game_invite_received",
                "from": event["from"],
                "game_id": game_id,
                "username": event["username"],
            }
        )

    async def user_logged_off(self, event):
        await self.send_json(
            {
                "type": "friend_logged_off",
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


class GameConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.accept()
        self.user = AnonymousUser()  # Until authenticated

    async def receive_json(self, content):
        type = content.get("type")
        if type == "auth":
            print("got into auth")
        elif type == "event":
            print("event")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f"user_{self.user.id}", self.channel_name
        )

    async def game_invite_received(self, event):
        await self.send_json({"type": "game_invite_received", "from": event["user_id"]})
