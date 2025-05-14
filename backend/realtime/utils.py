from django.contrib.auth.signals import user_logged_in
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import channel_layers, get_channel_layer
from django.dispatch import receiver
from django_redis import get_redis_connection

from db_handler import services


def is_user_online(user_id):
    conn = get_redis_connection("default")
    return conn.sismember("online_users", user_id)


def get_online_users():
    conn = get_redis_connection("default")
    return [int(uid.decode()) for uid in conn.smembers("online_users")]


async def notify_user_friends_on_login(user):
    online_ids = get_online_users()
    friends = sync_to_async(services.get_friends)(user)

    channel_layer = get_channel_layer()
    print("LAYERS:", channel_layers)
    for id in online_ids:
        if id != user.id:
            print(id)
            await channel_layer.group_send(
                f"user_{id}", {"type": "user_logged_in", "user_id": user.id}
            )
