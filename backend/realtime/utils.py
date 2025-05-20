import json
from asgiref.sync import sync_to_async
from channels.layers import channel_layers, get_channel_layer
from django_redis import get_redis_connection
from db_handler import services
import random
import string


def is_user_online(user_id):
    conn = get_redis_connection("default")
    return conn.sismember("online_users", user_id)


def get_online_users():
    conn = get_redis_connection("default")
    return [int(uid.decode()) for uid in conn.smembers("online_users")]


async def notify_user_friends_on_login(user):
    online_ids = get_online_users()
    friends = await sync_to_async(services.get_friends)(user)

    channel_layer = get_channel_layer()
    for id in online_ids:
        if id != user.id:
            await channel_layer.group_send(
                f"user_{id}", {"type": "user_logged_in", "user_id": user.id}
            )


async def notify_user_friends_on_logout(user):
    online_ids = get_online_users()
    friends = await sync_to_async(services.get_friends)(user)

    channel_layer = get_channel_layer()
    for id in online_ids:
        if id != user.id:
            await channel_layer.group_send(
                f"user_{id}", {"type": "user_logged_off", "user_id": user.id}
            )


async def notify_user_on_invite(friend_id, user, game_id):
    online_ids = get_online_users()
    if not (friend_id in online_ids):
        return None  # You can't invite someone that's offline, since we don't store invites in db
    channel_layer = get_channel_layer()
    await channel_layer.group_send(
        f"user_{friend_id}",
        {
            "type": "game_invite_received",
            "from": user.id,
            "username": user.username,
            "game_id": game_id,
        },
    )


async def notify_inviter_on_response(invite_from, user, accepted, game_id=None):
    online_ids = get_online_users()
    if not (invite_from in online_ids):
        return None  # You can't invite someone that's offline, since we don't store invites in db
    channel_layer = get_channel_layer()
    await channel_layer.group_send(
        f"user_{invite_from}",
        {
            "type": "game_invite_answered",
            "from": user.id,
            "username": user.username,
            "accepted": accepted,
            "game_id": game_id,
        },
    )


def create_new_game_id():
    conn = get_redis_connection("default")
    max_attempts = 10
    for i in range(0, max_attempts):
        game_id = "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
        if not conn.sismember("game_rooms", game_id):
            conn.sadd("game_rooms", game_id)
            return game_id
    return None


async def cache_quiz_questions(quiz_id):
    conn = get_redis_connection("default")
    stored = conn.get(quiz_id)
    if not stored:
        questions = await sync_to_async(services.get_questions_for_quiz)(
            quiz_id=quiz_id
        )
        conn.setex(quiz_id, 600, json.dumps(questions))


async def get_cached_quiz_questions(quiz_id):
    conn = get_redis_connection("default")
    cached = conn.get(quiz_id)

    if cached:
        return json.loads(cached)

    await cache_quiz_questions(quiz_id)
    return await get_cached_quiz_questions(quiz_id)


def update_user_progress(room_id, user_id, username, is_correct):
    key = f"game:room:{room_id}"
    conn = get_redis_connection("default")
    raw = conn.get(key)

    if raw:
        state = json.loads(raw)
    else:
        state = {"users": {}}

    user_data = state["users"].get(
        str(user_id),
        {
            "username": username,
            "question_index": 0,
            "correct_count": 0,
        },
    )

    user_data["question_index"] += 1
    if is_correct:
        user_data["correct_count"] += 1

    state["users"][str(user_id)] = user_data
    conn.set(key, json.dumps(state))

    return list(state["users"].values())


def get_room_members(room_name):
    conn = get_redis_connection("default")
    key = f"game_players:{room_name}"
    raw = conn.hgetall(key)
    return {
        k.decode(): v.decode() for k, v in raw.items()
    }  # Convert from bytes to str in a set


def all_users_finished(room_name, podium_usernames):
    members = get_room_members(room_name)
    member_usernames = set(members.values())
    print(member_usernames)
    print(podium_usernames)
    return member_usernames.issubset(set(podium_usernames))


async def compute_podium(room_name, user):
    conn = get_redis_connection("default")
    podium_key = f"podium:{room_name}"

    # Get existing podium
    raw = conn.get(podium_key)
    if raw:
        podium = json.loads(raw)
    else:
        podium = []

    if user not in podium:
        podium.append(user)

    conn.set(
        podium_key, json.dumps(podium)
    )  # We are saving all users finish, but only displaying top 3

    # Check if all users are finished
    if all_users_finished(room_name, podium):
        print(True)
        print(f"All users finished in room {room_name}. Final podium: {podium[:3]}")
        # Need to fire event to alert room to go back to select quiz state
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            f"game_{room_name}", {"type": "all_players_finished"}
        )
        # Cleanup some old game data
        conn.delete(f"podium:{room_name}")
        conn.delete(f"game:room:{room_name}")
        conn.delete(f"game_players:{room_name}")

    return podium[:3]
