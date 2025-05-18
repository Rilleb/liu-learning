from db_handler.models import Course
from db_handler.services import create_course
from db_handler.serializers import ChapterSerializer, CourseSerializer
from django.utils.timezone import now
from db_handler.serializers import (
    CourseSerializer,
    QuizSerializer,
    UserSerializer,
    QuizAttemptSerializer,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate, user_logged_in
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth.hashers import make_password
from db_handler import services
from django_redis import get_redis_connection


def get_user_from_token(token):
    try:
        token = Token.objects.get(key=token)
        return token.user  # This is the associated user
    except Token.DoesNotExist:
        return None


def get_auth_token(request):
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header and auth_header.startswith("Token "):
        token = auth_header.split("Token ")[1]
        return token
    else:
        return None


# Create your views here.
class CourseView(APIView):

    def post(self, request):
        token = get_auth_token(request)
        if not token:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        name = data.get("title")
        code = data.get("code")
        description = data.get("description")
        chapters = data.get("chapters")

        created_by_user = get_user_from_token(token)
        if not created_by_user:
            return Response(
                {"Message": {"Token was not included or has expired"}},
                status.HTTP_401_UNAUTHORIZED,
            )

        course = create_course(name, code, description, created_by_user, chapters)
        if course:
            return Response({"message": "Course created"}, status=status.HTTP_200_OK)
        return Response(
            {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):
        token = get_auth_token(request)
        if not token:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)

        user = get_user_from_token(token=token)
        if not user:
            return Response(
                {"Message": {"Token was not included or has expired"}},
                status.HTTP_401_UNAUTHORIZED,
            )

        fetch_all = request.query_params.get("all", "").lower() == "true"

        if fetch_all:
            courses = services.get_all_courses()
        else:
            courses = services.get_courses(user=user)

        serilizer = CourseSerializer(courses, many=True)
        return Response(serilizer.data)


class ChaptersView(APIView):

    def get(self, request):
        token = get_auth_token(request)
        if not token:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)

        course_id = request.query_params.get("id", "")

        chapters = services.get_course_chapters(course_id)

        print(chapters)

        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data)


class QuizView(APIView):

    def post(self, request):
        token = get_auth_token(request)
        if not token:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)

        data = request.data
        name = data.get("title")
        courseId = data.get("courseId")
        chapterId = data.get("chapterId")
        description = data.get("description")
        questions = data.get("questions")
        answerTypes = data.get("answerTypes")
        answers = data.get("answers")

        created_by_user = get_user_from_token(token)
        if not created_by_user:
            return Response(
                {"Message": {"Token was not included or has expired"}},
                status.HTTP_401_UNAUTHORIZED,
            )

        quiz = services.create_quiz(
            name,
            courseId,
            chapterId,
            description,
            questions,
            answerTypes,
            answers,
            created_by_user,
        )
        if quiz:
            return Response({"message": "Course created"}, status=status.HTTP_200_OK)
        return Response(
            {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)
            if not user:
                return Response(
                    {"Message": {"Token was not included or has expired"}},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            quizes = services.get_quizes(user=user)
            serilizer = QuizSerializer(quizes, many=True)
            return Response(serilizer.data)
        else:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)


class Friendsview(APIView):
    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)
            if not user:
                return Response({"Message": {"Token was not included or has expired"}})
            offline, online = services.get_friends(user=user)
            online_serilizer = UserSerializer(online, many=True)
            offline_serilizer = UserSerializer(offline, many=True)

            return Response(
                {"online": online_serilizer.data, "offline": offline_serilizer.data}
            )
        else:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)


class AttemptStatisticsView(APIView):
    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)
            if not user:
                return Response(
                    {
                        "Message": {
                            "Token has expired, our has no user associated with it"
                        }
                    }
                )
            attempts = services.get_quiz_statistics(user=user)
            return Response(attempts)
        else:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)


class FriendStatisticsView(APIView):
    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        friend = request.query_params.get("friend")
        if auth_header and auth_header.startswith("Token ") and friend:
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token)
            if not user:
                return Response(
                    {
                        "Message": {
                            "Token has expired, our has no user associated with it"
                        }
                    }
                )

            if not services.is_friend_with(user, friend):
                return Response({"Message": "Can only get statistics from friends"})
            attempts = services.get_combined_quiz_statistics(user=user, friend=friend)
            return Response(attempts)
        else:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)


class FindUser(APIView):
    def get(self, request, *args, **kwargs):

        query = request.query_params.get("friend", None)
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token ") and query:
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)
            if not user:
                return Response(
                    {
                        "Message": {
                            "Token has expired, our has no user associated with it"
                        }
                    }
                )
            friends = services.find_friend(user=user, query=query)
            serilizer = UserSerializer(friends, many=True)
            return Response(serilizer.data)
        else:
            return Response(
                f"{'Missing auth header' if not auth_header else 'No args were passed in'}"
            )


# ----------------------------------------------------
# Auth stuff
User = get_user_model()


class GoogleSyncView(APIView):

    def post(self, request):
        data = request.data
        email = data.get("email")
        google_id = data.get("sub")
        name = data.get("name")

        if not email or not google_id:
            return Response(
                {"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": name,
            },
        )

        if not created:
            user.first_name = name  # update name if needed
            user.save()

        user.last_login = now()
        user.save(update_fields=["last_login"])
        user_logged_in.send(sender=user.__class__, request=request, user=user)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"access_token": token.key})


class GithubSyncView(APIView):

    def post(self, request):
        data = request.data
        email = data.get("email")
        github_id = data.get("sub")
        name = data.get("name")
        if not email or not github_id:
            return Response(
                {"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": name,
            },
        )

        if not created:
            user.first_name = name  # update name if needed
            user.save()

        user.last_login = now()
        user.save(update_fields=["last_login"])
        user_logged_in.send(sender=user.__class__, request=request, user=user)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"access_token": token.key})


class UserCreateView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Hash the password
        hashed_password = make_password(password)

        # Create user in the database
        user = User.objects.create(
            username=username, email=email, password=hashed_password
        )
        # Create user in the database
        user = services.create_user(username=username, email=email, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)

            return Response({"access_token": token.key})
        else:
            return Response(
                "Error, could not create user", status=status.HTTP_400_BAD_REQUEST
            )


class CredentialsLoginView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        # Authenticate user using Django's authenticate method
        user = authenticate(request, username=user.username, password=password)

        user = authenticate(username=user.username, password=password)
        if user:
            user.last_login = now()
            user.save(update_fields=["last_login"])
            user_logged_in.send(sender=user.__class__, request=request, user=user)

            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {"access_token": token.key, "user_id": user.id, "email": user.email}
            )
        else:
            return Response({"error": "Invalid credentials"}, status=400)


class QuizDescription(APIView):
    def get(self, request):
        quizId = request.query_params.get("quiz_id", None)
        description = services.get_quiz_description(quizId == quizId)
        return Response(description)


class QuizName(APIView):
    def get(self, request):
        quizId = request.query_params.get("quiz_id", None)
        name = services.get_quiz_name(quizId == quizId)
        return Response(name)


class QuestionCount(APIView):
    def get(self, request):
        quizId = request.query_params.get("quiz_id", None)
        count = services.get_question_count(quizId == quizId)
        return Response(count)


class CourseName(APIView):
    def get(self, request):
        courseId = request.query_params.get("course_id", None)
        name = services.get_course_name(courseId)
        return Response(name)


class Questions(APIView):
    def get(self, request):
        try:
            quiz_id = request.query_params.get("quiz_id", None)
            questions = services.get_questions_for_quiz(quiz_id)
            return Response(questions)
        except:
            return Response({"error": "Could not get quiz questions"}, status=400)


class QuizAttempt(APIView):
    def post(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)

            quiz = request.data.get("quiz_id")
            end = request.data.get("ended_at")
            passed = request.data.get("passed")
            # Create user in the database
            attempt = services.create_quiz_attempt(user=user, quiz=quiz, ended_at=end, passed=passed)
            if attempt:
                return Response({
                    "message": "Successfully added attempt",
                    "attempt_id": attempt.id
                }, status=status.HTTP_201_CREATED)
            else:
                return Response( "Error, could not add quiz attempt", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response( "Error, could not find user", status=status.HTTP_400_BAD_REQUEST)
        

class QuestionAttempt(APIView):
    def post(self, request):
        data = json.loads(request.body)
        attempt = data.get("attempt")
        question = data.get("question")
        is_correct = data.get("is_correct")
        is_multiple = data.get("is_multiple_choice")
        free_text = data.get("free_text_answer")
        started = data.get("started_at")
        ended = data.get("ended_at")

        attempt = services.create_question_answer(attempt=attempt, question=question, is_correct=is_correct, 
                                                  multiple_choice_answer=is_multiple, free_text_answer=free_text, 
                                                  started_at=started, ended_at=ended)
        if attempt:
            return Response("Successfully added question attempt", status=status.HTTP_201_CREATED)
        else:
            return Response( "Error, could not add question attempt", status=status.HTTP_400_BAD_REQUEST)
    
        
class ChangeQuizAttempt(APIView):
    def put(self, request):
        data = json.loads(request.body)
        attempt_id = data.get("attempt_id")
        end = data.get("ended_at")
        passed = data.get("passed")
        attempt = services.change_quiz_attempt(attempt_id=attempt_id, ended_at=end, passed=passed)
        serializer = QuizAttemptSerializer(attempt)
        if attempt:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response( "Error, could not add quiz attempt", status=status.HTTP_400_BAD_REQUEST)
