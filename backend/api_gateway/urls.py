from django.urls import path
from .views import *

urlpatterns = [
    path("courses/", CourseView.as_view(), name="courses"),
    path("courses/chapters/", ChaptersView.as_view(), name="chapters"),
    path("courses/follow/", ToggleFollowCourse.as_view(), name="follow-course"),
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
    path(
        "statistics/quiz/attempts",
        AttemptStatisticsView.as_view(),
        name="stats-attempts",
    ),
    path("statistics/compate/friend", FindUser.as_view(), name="find_friend"),
    path("courses/name", CourseName.as_view(), name="course_name"),
    path("quiz/questions", Questions.as_view(), name="questions-from-quiz"),
    path("quiz_attempt/", QuizAttempt.as_view(), name="quiz_attempt"),
    path("question_attempt/", QuestionAttempt.as_view(), name="question-attempt"),
    path(
        "quiz_attempt/change", ChangeQuizAttempt.as_view(), name="change_quiz_attempt"
    ),
    path(
        "statistics/compare/stats",
        FriendStatisticsView.as_view(),
        name="compare-with-friend",
    ),
]
