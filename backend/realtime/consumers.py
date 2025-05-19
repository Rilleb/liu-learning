from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import user_logged_in, user_logged_out
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token

from db_handler import services
from realtime import utils
from realtime.utils import (
    cache_quiz_questions,
    create_new_game_id,
    get_cached_quiz_questions,
    notify_inviter_on_response,
    notify_user_on_invite,
    update_user_progress,
)


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
        elif type == "create_game":
            game_id = create_new_game_id()
            await self.send_json(
                {
                    "game_id": game_id,
                    "type": "unique_room_id_created",
                    "owner": self.user.id,
                    "owner_name": self.user.username,
                }
            )
        elif type == "invite_user":
            friend = content.get("user_id")
            game_id = content.get("game_id")
            print(content)
            await notify_user_on_invite(friend, self.user, game_id)
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

    async def user_logged_off(self, event):
        await self.send_json(
            {
                "type": "friend_logged_off",
                "user_id": event["user_id"],
            }
        )

    async def game_invite_answered(self, event):
        print(event)
        await self.send_json(
            {
                "type": "game_invite_answered",
                "accepted": event["accepted"],
                "username": event["username"],
                "game_id": event["game_id"],
            }
        )

    async def game_invite_received(self, event):
        await self.send_json(
            {
                "type": "game_invite_received",
                "from": event["from"],
                "username": event["username"],
                "game_id": event["game_id"],
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
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"game_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        self.user = AnonymousUser()  # Until authenticated

    async def receive_json(self, content):
        type = content.get("type")
        if type == "auth":
            token_key = content.get("token")
            try:
                token = await sync_to_async(Token.objects.select_related("user").get)(
                    key=token_key
                )
                self.user = token.user
                await self.send_json({"status": "authenticated game socket"})
            except Token.DoesNotExist:
                await self.send_json({"error": "Invalid token"})
                await self.close()
        elif type == "game_started":
            questions = await get_cached_quiz_questions(content.get("quiz"))
            # print(content)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_started",
                    "questions": questions,
                    "quiz": content.get("quiz"),
                    "timelimit": content.get("timelimit"),
                },
            )
        elif type == "quiz_selected":
            quiz_id = content.get("quiz")
            await cache_quiz_questions(quiz_id=quiz_id)
        elif type == "question_answered":
            progress = update_user_progress(
                self.room_name,
                content.get("user_id"),
                content.get("username"),
                content.get("is_correct"),
            )
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "user_progress", "users": progress},
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f"user_{self.user.id}", self.channel_name
        )

    async def game_started(self, event):
        await self.send_json(
            {
                "type": "game_start",
                "questions": event["questions"],
                "quiz": event["quiz"],
                "timelimit": event["timelimit"],
            }
        )

    async def user_progress(self, event):
        await self.send_json({"type": "user_progress", "users": event["users"]})
