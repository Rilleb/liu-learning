from django.urls import path
from .views import *

urlpatterns = [
    path("courses/", CourseView.as_view(), name="courses"),
    path("auth/google-login/", GoogleSyncView.as_view(), name="google-sync"),
    path("auth/github-login/", GithubSyncView.as_view(), name="github-sync"),
    path(
        "auth/credentials-login/",
        CredentialsLoginView.as_view(),
        name="credentials-sync",
    ),
    path("auth/credentials-create", UserCreateView.as_view(), name="create-user"),
    path("quiz/", QuizView.as_view(), name="quiz"),
    path("friends/", Friendsview.as_view(), name="friends"),
    path("quiz/description/", QuizDescription.as_view(), name="description"),
    path("quiz/name/", QuizName.as_view(), name="quizName"),
    path("quiz/questionCount/", QuestionCount.as_view(), name="questionCount"),
]
