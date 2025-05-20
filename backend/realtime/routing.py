from django.urls import re_path
from realtime.consumers import GameConsumer, UserConsumer

websocket_urlpatterns = [
    re_path(r"ws/users/(?P<user_id>\w+)/$", UserConsumer.as_asgi()),
    re_path(r"ws/game/room/(?P<room_id>\w+)/$", GameConsumer.as_asgi()),
]
