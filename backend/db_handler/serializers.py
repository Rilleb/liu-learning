from rest_framework import serializers
from .models import User, Course, Chapter, Quiz, Question, ReadCourse, QuizAttempt, QuizAnswer, Friendship


# Serializer for the User model (inherited from AbstractUser)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'date_joined', 'is_active']


# Serializer for the Course model
class CourseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'created_by', 'date_created']


# Serializer for the Chapter model
class ChapterSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model
    course_id = CourseSerializer()  # Nested serializer for the Course model

    class Meta:
        model = Chapter
        fields = ['id', 'name', 'created_by', 'course_id', 'date_created']


# Serializer for the Quiz model
class QuizSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()  # Nested serializer for the User model
    course_id = CourseSerializer()  # Nested serializer for the Course model
    chapter_id = ChapterSerializer()  # Nested serializer for the Chapter model

    class Meta:
        model = Quiz
        fields = ['id', 'course_id', 'name', 'chapter_id', 'created_by', 'date_created', 'description']


# Serializer for the Question model
class QuestionSerializer(serializers.ModelSerializer):
    quiz_id = QuizSerializer()  # Nested serializer for the Quiz model

    class Meta:
        model = Question
        fields = ['id', 'quiz_id', 'description', 'index', 'is_multiple', 'free_text_answer', 'alt_1', 'alt_2', 'alt_3', 'correct_answer']


# Serializer for the ReadCourse model
class ReadCourseSerializer(serializers.ModelSerializer):
    user_id = UserSerializer()  # Nested serializer for the User model
    course_id = CourseSerializer()  # Nested serializer for the Course model

    class Meta:
        model = ReadCourse
        fields = ['id', 'user_id', 'course_id']


# Serializer for the QuizAttempt model
class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_id = QuizSerializer()  # Nested serializer for the Quiz model
    user_id = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz_id', 'user_id', 'attempt_started_at', 'attempt_ended_at', 'passed']


# Serializer for the QuizAnswer model
class QuizAnswerSerializer(serializers.ModelSerializer):
    attempt_id = QuizAttemptSerializer()  # Nested serializer for the QuizAttempt model
    question_id = QuestionSerializer()  # Nested serializer for the Question model

    class Meta:
        model = QuizAnswer
        fields = ['id', 'attempt_id', 'is_correct', 'attempt_started_at', 'attempt_ended_at', 'question_id', 'multiple_chooice_answer', 'free_text_answer']


# Serializer for the Friendship model
class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()  # Nested serializer for the User model
    user2 = UserSerializer()  # Nested serializer for the User model

    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'created_at']
