from db_handler.models import Course
from db_handler.services import create_course, create_chapter
from db_handler.serializers import CourseSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from django.contrib.auth.hashers import make_password


User = get_user_model()


# Create your views here.
class CourseView(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serilizer = CourseSerializer(courses, many=True)
        return Response(serilizer.data)

    def post(self, request):
        data = request.data
        name = data.get("title")
        code = data.get("code")
        description = data.get("description")
        created_by = "temp"

        course = create_course(name, code, description, created_by)
        if course:
            return Response({"message": "Course created"}, status=status.HTTP_200_OK)
        return Response(
            {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


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

        token, _ = Token.objects.get_or_create(user=user)

        return Response({"access_token": token.key})


class CredentialsLoginView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        # Look up the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        # Authenticate user using Django's authenticate method
        user = authenticate(request, username=user.username, password=password)

        if user:
            # Generate an authentication token
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"access_token": token.key})
        else:
            return Response({"error": "Invalid credentials"}, status=400)
