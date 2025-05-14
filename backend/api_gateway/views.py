from django.utils.timezone import now
from db_handler.serializers import (
    CourseSerializer,
    QuizSerializer,
    UserSerializer,
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


class CourseView(APIView):

    def get(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split("Token ")[1]
            user = get_user_from_token(token=token)
            if not user:
                return Response(
                    {"Message": {"Token was not included or has expired"}},
                    status.HTTP_401_UNAUTHORIZED,
                )
            courses = services.get_courses(user=user)
            serilizer = CourseSerializer(courses, many=True)
            return Response(serilizer.data)
        else:
            return Response("Missing auth header", status=status.HTTP_401_UNAUTHORIZED)


class QuizView(APIView):

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
