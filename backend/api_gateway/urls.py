from django.urls import path
from .views import CourseView, CredentialsLoginView, GithubSyncView, GoogleSyncView, QuizView, UserCreateView 


urlpatterns = [
    path('courses/', CourseView.as_view(), name='courses'),
    path("auth/google-login/", GoogleSyncView.as_view(), name="google-sync"),
    path("auth/github-login/", GithubSyncView.as_view(), name="github-sync"),
    path("auth/credentials-login/", CredentialsLoginView.as_view(), name="credentials-sync"),
    path("auth/credentials-create", UserCreateView.as_view(), name="create-user"),
    path("quiz/", QuizView.as_view(), name='quiz')
]

