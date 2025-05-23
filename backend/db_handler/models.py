from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.base import CASCADE

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
    description = models.TextField(default="", blank=True)


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    description = models.TextField()
    index = models.IntegerField()
    is_multiple = models.BooleanField()
    alt_1 = models.TextField(default="", blank=True)
    alt_2 = models.TextField(default="", blank=True)
    alt_3 = models.TextField(default="", blank=True)
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
    attempt_started_at = models.DateTimeField(
        auto_now_add=True
    )  # Need in seconds for statistics
    attempt_ended_at = models.DateTimeField(null=True)
    passed = models.BooleanField()


class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    attempt_started_at = models.DateTimeField()
    attempt_ended_at = models.DateTimeField(auto_now_add=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    multiple_chooice_answer = models.IntegerField(default=0, blank=True)
    free_text_answer = models.TextField(default="", blank=True)


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


class FriendInvites(models.Model):
    to = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_invites_received"
    )
    from_friend = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_invites_sent"
    )
    created_at = models.DateTimeField(auto_now_add=True)
