from django.contrib import admin
from db_handler.models import (
    Chapter,
    QuizAnswer,
    QuizAttempt,
    User,
    Course,
    Quiz,
    ReadCourse,
)

# Register your models here.
admin.site.register(User)
admin.site.register(Course)
admin.site.register(Chapter)
admin.site.register(Quiz)
admin.site.register(ReadCourse)
admin.site.register(QuizAttempt)
admin.site.register(QuizAnswer)
