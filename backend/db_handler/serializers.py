from rest_framework import serializers
from .models import (
    User,
    Course,
    Chapter,
    Quiz,
    Question,
    ReadCourse,
    QuizAttempt,
    QuizAnswer,
    Friendship,
)


# Serializer for the User model (inherited from AbstractUser)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "is_active",
        ]


# Serializer for the Course model
class CourseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = Course
        fields = ["id", "name", "code", "created_by", "date_created"]


# Serializer for the Chapter model
class ChapterSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model
    course = CourseSerializer()  # Nested serializer for the Course model

    class Meta:
        model = Chapter
        fields = ["id", "name", "created_by", "course", "date_created"]


# Serializer for the Quiz model
class QuizSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model
    course = CourseSerializer()  # Nested serializer for the Course model
    chapter = ChapterSerializer()  # Nested serializer for the Chapter model

    class Meta:
        model = Quiz
        fields = [
            "id",
            "course",
            "name",
            "chapter",
            "created_by",
            "date_created",
            "description",
        ]


# Serializer for the Question model
class QuestionSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer()  # Nested serializer for the Quiz model

    class Meta:
        model = Question
        fields = [
            "id",
            "quiz",
            "description",
            "index",
            "is_multiple",
            "alt_1",
            "alt_2",
            "alt_3",
            "correct_answer",
        ]


# Serializer for the ReadCourse model
class ReadCourseSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the User model
    course = CourseSerializer()  # Nested serializer for the Course model

    class Meta:
        model = ReadCourse
        fields = ["id", "user", "course"]


# Serializer for the QuizAttempt model
class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer()  # Nested serializer for the Quiz model
    user = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = QuizAttempt
        fields = [
            "id",
            "quiz",
            "user",
            "attempt_started_at",
            "attempt_ended_at",
            "passed",
        ]


# Serializer for the QuizAnswer model
class QuizAnswerSerializer(serializers.ModelSerializer):
    attempt = QuizAttemptSerializer()  # Nested serializer for the QuizAttempt model
    question = QuestionSerializer()  # Nested serializer for the Question model

    class Meta:
        model = QuizAnswer
        fields = [
            "id",
            "attempt",
            "is_correct",
            "attempt_started_at",
            "attempt_ended_at",
            "question",
            "multiple_chooice_answer",
            "free_text_answer",
        ]


# Serializer for the Friendship model
class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()  # Nested serializer for the User model
    user2 = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = Friendship
        fields = ["user1", "user2", "created_at"]
