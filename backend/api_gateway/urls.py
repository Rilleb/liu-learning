from django.urls import path
from .views import CourseView


urlpatterns = [
    path('api/', CourseView.as_view(), name='course'),
]
