from django.urls import path
from .views import (
    AttemptStatisticsView,
    CourseView,
    CredentialsLoginView,
    FindUser,
    FriendStatisticsView,
    Friendsview,
    GithubSyncView,
    GoogleSyncView,
    QuizView,
    UserCreateView,
)


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
    path(
        "statistics/quiz/attempts",
        AttemptStatisticsView.as_view(),
        name="stats-attempts",
    ),
    path("statistics/compate/friend", FindUser.as_view(), name="find_friend"),
    path(
        "statistics/compare/stats",
        FriendStatisticsView.as_view(),
        name="compare-with-friend",
    ),
]
