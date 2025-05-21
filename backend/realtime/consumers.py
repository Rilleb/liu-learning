from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import user_logged_in, user_logged_out
from django.contrib.auth.models import AnonymousUser
from django.forms.utils import from_current_timezone
from rest_framework.authtoken.models import Token
from django_redis import get_redis_connection
from db_handler import services
from realtime.utils import (
    add_friend_invite,
    cache_quiz_questions,
    compute_podium,
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
                await self.send_json(
                    {
                        "load_friend_invites": await sync_to_async(
                            services.get_friend_invites
                        )(self.user)
                    }
                )
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
            await notify_user_on_invite(friend, self.user, game_id)
        elif type == "game_invite_accepted":
            invite_from = content.get("invite_came_from")
            await notify_inviter_on_response(
                invite_from, self.user, True, content.get("game_id")
            )
        elif type == "game_invite_declined":
            invite_from = content.get("invite_came_from")
            await notify_inviter_on_response(invite_from, self.user, False)
        elif type == "friend_invite":
            to = content.get("to")
            await add_friend_invite(from_friend=self.user, to=to)
        elif type == "accept_friend_invite":
            invite_id = content.get("invitor_id")
            invite = await sync_to_async(
                FriendInvites.objects.select_related("from_friend").get
            )(id=invite_id)

            if invite.to_id != self.user.id:
                await self.send_json({"error": "Unauthorized"})
                return

            await self.channel_layer.group_send(
                f"user_{invite.from_friend.id}",
                {
                    "type": "friend_invite_accepted",
                    "from_id": self.user.id,
                    "from_username": self.user.username,
                },
            )

            await sync_to_async(invite.delete)()
            await self.send_json({"status": "Friend invite accepted"})

        elif type == "decline_friend_invite":
            invite_id = content.get("invite_id")
            invite = await sync_to_async(FriendInvites.objects.get)(id=invite_id)

            if invite.to_id != self.user.id:
                await self.send_json({"error": "Unauthorized"})
                return

            await sync_to_async(invite.delete)()
            await self.send_json({"status": "Friend invite declined"})
        else:
            if self.user.is_authenticated:
                # Handle other messages here
                await self.send_json(
                    {"echo": "Could not find any matching function", "content": content}
                )
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

    async def friend_invite_received(self, event):
        await self.send_json(
            {
                "type": "friend_invite_received",
                "from": event["from"],
                "username": event["username"],
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

                # Store user in Redis set for the room
                conn = get_redis_connection("default")
                key = f"room_members:{self.room_name}"
                conn.hset(key, self.user.id, self.user.username)
                conn = get_redis_connection("default")
                owner_key = f"room_owner:{self.room_name}"
                current_owner = conn.get(owner_key)

                if current_owner is None:
                    conn.set(owner_key, self.user.id)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "room_owner_changed", "owner_id": self.user.id},
                    )

                await self.send_json({"status": "authenticated game socket"})
                if current_owner:
                    await self.send_json(
                        {
                            "type": "room_owner_changed",
                            "owner_id": int(current_owner),
                        }
                    )  # Each time someone connects (or reconnects send owner since it can change/they need to know)

            except Token.DoesNotExist:
                await self.send_json({"error": "Invalid token"})
                await self.close()
        elif type == "game_started":
            questions = await get_cached_quiz_questions(content.get("quiz"))
            conn = get_redis_connection("default")
            members = conn.hgetall(f"room_members:{self.room_name}")
            conn.delete(f"game_players:{self.room_name}")
            for user_id, username in members.items():
                conn.hset(f"game_players:{self.room_name}", user_id, username)
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
        elif type == "user_finished":
            username = content.get("user")
            podium = await compute_podium(self.room_name, username)
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "podium_updated", "podium": podium}
            )
        elif type == "restart_game":
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "restart_game"}
            )

    async def disconnect(self, close_code):
        if (
            hasattr(self, "user")
            and self.user
            and not isinstance(self.user, AnonymousUser)
        ):
            conn = get_redis_connection("default")
            key = f"game_players:{self.room_name}"
            conn.hdel(key, self.user.id)
            key = f"room_members:{self.room_name}"
            conn.hdel(key, self.user.id)
            # Check if this user was the room owner
            owner_key = f"room_owner:{self.room_name}"
            current_owner = conn.get(owner_key)
            if current_owner and int(current_owner.decode()) == self.user.id:
                # Reassign ownership
                members = conn.hgetall(key)
                if members:
                    new_owner_id = next(iter(members.keys()))
                    conn.set(owner_key, new_owner_id)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {"type": "room_owner_changed", "owner_id": int(new_owner_id)},
                    )
                else:
                    # If no members remove from cache
                    conn.delete(owner_key)

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def game_started(self, event):
        await self.send_json(
            {
                "type": "game_start",
                "questions": event["questions"],
                "quiz": event["quiz"],
                "timelimit": event["timelimit"],
            }
        )

    async def restart_game(self, event):
        await self.send_json({"type": "restart_game"})

    async def user_progress(self, event):
        await self.send_json({"type": "user_progress", "users": event["users"]})

    async def podium_updated(self, event):
        await self.send_json({"type": "podium_updated", "podium": event["podium"]})

    async def all_players_finished(self, event):
        await self.send_json({"type": "all_players_finished"})

    async def room_owner_changed(self, event):
        await self.send_json(
            {"type": "room_owner_changed", "owner_id": event["owner_id"]}
        )
