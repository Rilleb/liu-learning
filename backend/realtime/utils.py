from django.contrib.auth.signals import user_logged_in
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.dispatch import receiver


@receiver(user_logged_in)
def notify_friends_on_login(sender, user, request, **kwargs):
    channel_layer = get_channel_layer()
    friends = user.friends.all()  # Assuming a many-to-many relation
    for friend in friends:
        group_name = f"friends_{friend.id}"
        async_to_sync(channel_layer.group_send)(
            group_name, {"type": "friend_logged_in", "friend_id": user.id}
        )
