from django.contrib import admin
from db_handler.models import Chapter, User, Course, Quiz

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Chapter)
admin.site.register(Quiz)
