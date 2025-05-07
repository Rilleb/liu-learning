from django.contrib import admin
from db_handler.models import User, Course, Quiz

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Quiz)
