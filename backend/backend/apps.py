from django.apps import AppConfig


class Config(AppConfig):
    name = "backend"

    def ready(self):
        import backend.signals
