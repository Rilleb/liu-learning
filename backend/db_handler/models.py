from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    # username = models.CharField(max_length=40)
    pass


class Course(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(default=None)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateField()


class Chapter(models.Model):
    name = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_created = models.DateField()


class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateField()
    description = models.TextField()


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    description = models.TextField()
    index = models.IntegerField()
    is_multiple = models.BooleanField()
    free_text_answer = models.TextField()
    alt_1 = models.TextField()
    alt_2 = models.TextField()
    alt_3 = models.TextField()
    correct_answer = models.TextField()


# Relational databases from here and down
class ReadCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "course")



class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    attempt_started_at = models.DateTimeField()  # Need in seconds for statistics
    attempt_ended_at = models.DateTimeField()
    passed = models.BooleanField()


class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    attempt_started_at = models.DateTimeField()
    attempt_ended_at = models.DateTimeField()
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    multiple_chooice_answer = models.IntegerField()
    free_text_answer = models.TextField()


class Friendship(models.Model):
    user1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendships_initiated"
    )
    user2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendships_received"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user1", "user2")
