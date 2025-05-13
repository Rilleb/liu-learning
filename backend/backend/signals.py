from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django_redis import get_redis_connection


# Basically an event listener, function is run each time user_logged_in is called
@receiver(user_logged_in)
def handle_user_logged_in(sender, request, user, **kwargs):
    print(f"User just logged in:  {user}")
    conn = get_redis_connection("default")
    conn.sadd("online_users", user.id)


@receiver(user_logged_out)
def handle_user_logged_out(sender, request, user, **kwargs):
    conn = get_redis_connection("default")
    conn.srem("online_users", user.id)
