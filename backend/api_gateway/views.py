from django.shortcuts import render
from db_handler.models import Course
from db_handler.serializers import CourseSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
class CourseView(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serilizer = CourseSerializer(courses, many=True)
        return Response(serilizer.data)


