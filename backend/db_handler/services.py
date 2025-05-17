from django.contrib.auth import get_user, get_user_model
from collections import defaultdict
from django.db.models import Q
from django.db.models import DateField
from django.db.models.functions import Cast
from . import internal_services
from . import models


def create_user(username, email, password):
    try:
        return internal_services.create_user(username, email, password)
    except Exception as e:
        print(f"Error creating user: {e}")
        return None


def create_course(name, code, created_by, date_created=None):
    try:
        return internal_services.create_course(name, code, created_by, date_created)
    except Exception as e:
        print(f"Error creating course: {e}")
        return None


def create_chapter(name, course, created_by, date_created=None):
    try:
        return internal_services.create_chapter(name, course, created_by, date_created)
    except Exception as e:
        print(f"Error creating chapter: {e}")
        return None


def create_quiz(name, course, chapter, created_by, description="", date_created=None):
    try:
        return internal_services.create_quiz(
            name, course, chapter, created_by, description, date_created
        )
    except Exception as e:
        print(f"Error creating quiz: {e}")
        return None


def create_question(
    quiz,
    description,
    index,
    is_multiple=False,
    free_text_answer="",
    alt_1="",
    alt_2="",
    alt_3="",
    correct_answer="",
):
    try:
        return internal_services.create_question(
            quiz,
            description,
            index,
            is_multiple,
            free_text_answer,
            alt_1,
            alt_2,
            alt_3,
            correct_answer,
        )
    except Exception as e:
        print(f"Error creating question: {e}")
        return None


def add_friend(user1, user2):
    try:
        return internal_services.add_friend(user1, user2)
    except Exception as e:
        print(f"Error adding friend: {e}")
        return None


def mark_course_as_read(user, course):
    try:
        return internal_services.mark_course_as_read(user, course)
    except Exception as e:
        print(f"Error marking course as read: {e}")
        return None


def create_quiz_attempt(user, quiz, ended_at=None, passed=False):
    try:
        actual_quiz = models.Quiz.objects.filter(id = quiz).first()
        if not passed: 
            passed = False
        return internal_services.create_quiz_attempt(
            user, actual_quiz, ended_at, passed
        )
    except Exception as e:
        print(f"Error creating quiz attempt: {e}")
        return None


def create_question_answer(
    attempt,
    question,
    is_correct,
    multiple_choice_answer=False,
    free_text_answer="",
    started_at=None,
    ended_at=None,
):
    try:
        actual_attempt = models.QuizAttempt.objects.filter(id = attempt).first()
        actual_question = models.Question.objects.filter(id = question).first()
        if not multiple_choice_answer:
            multiple_choice_answer = False
        return internal_services.create_question_answer(
            actual_attempt,
            actual_question,
            is_correct,
            multiple_choice_answer,
            free_text_answer,
            started_at,
            ended_at,
        )
    except Exception as e:
        print(f"Error creating quiz answer: {e}")
        return None


User = get_user_model()


def get_courses(user):
    try:
        courses = models.Course.objects.filter(readcourse__user=user)
        print("Courses", courses)
        return courses
    except Exception as e:
        print(f"Error creating quiz answer: {e}")
        return None


def get_quizes(user):
    try:
        quizes = models.Quiz.objects.filter(
            course__in=models.ReadCourse.objects.filter(user=user).values("course_id")
        )
        return quizes
    except Exception as e:
        print(f"Could not get quizes: {e}")
        return None


def get_friends(user):
    try:
        friendships = models.Friendship.objects.filter(Q(user1=user) | Q(user2=user))
        friends = [f.user2 if f.user1 == user else f.user1 for f in friendships]
        print(friends)
        return friends
    except Exception as e:
        print(f"Could not get friends, error: {e}")
        return None


def get_quiz_description(quiz_id):
    try:
        description = models.Quiz.objects.filter(id = quiz_id).first().description
        return description
    except Exception as e:
        print(f"Could not get quiz description: {e}")
        return None
  
  
def get_quiz_name(quiz_id):
    try:
        name = models.Quiz.objects.filter(id = quiz_id).first().name
        return name
    except Exception as e:
        print(f"Could not get quiz name: {e}")
        return None

      
def get_question_count(quiz_id):
    try:
        count = models.Question.objects.filter(quiz_id = quiz_id).count()
        return count
    except Exception as e:
        print(f"Could not get question count: {e}")
        return None
      
      
def get_quiz_statistics(user):
    try:
        attempts = (
            models.QuizAttempt.objects.filter(user=user)
            .annotate(date_only=Cast("attempt_ended_at", output_field=DateField()))
            .order_by("date_only")
        )
        daily_counts = defaultdict(int)
        daily_sucess = defaultdict(int)
        daily_time_spent = defaultdict(float)
        for attempt in attempts:
            if attempt.passed:
                daily_sucess[attempt.date_only] += 1
            daily_counts[attempt.date_only] += 1
            duration = (
                attempt.attempt_ended_at - attempt.attempt_started_at
            ).total_seconds()
            daily_time_spent[attempt.date_only] += duration

        cumulative = []
        total = 0
        successfull = 0
        for d in sorted(daily_counts.keys()):
            total += daily_counts[d]
            successfull += daily_sucess[d]
            cumulative.append(
                {
                    "date": d,
                    "total_attempts": total,
                    "successfull_attempts": successfull,
                    "ratio": successfull
                    / total,  # Ratio of successfull vs number tried
                    "total_time_spent": daily_time_spent[d],
                }
            )

        return cumulative
    except Exception as e:
        print(f"Could not get statisics, Error: {e}")
        return None


def find_friend(user, query):
    try:
        friendships = models.Friendship.objects.filter(Q(user1=user) | Q(user2=user))

        friend_ids = [
            f.user2.id if f.user1 == user else f.user1.id for f in friendships
        ]

        friends = User.objects.filter(id__in=friend_ids, username__icontains=query)[:5]

        print(friends)
        return friends
    except Exception as e:
        print(f"Could not find any friends with that pattern, Pattern: {e}")
        return None


def get_course_name(course_id):
    try:
        print(course_id)
        name = models.Course.objects.filter(id=course_id).first().name
        return name
    except Exception as e:
        print(f"Could not get course name: {e}")
        return None
    
def get_questions_for_quiz(quiz_id):
    try:
        print("id ", quiz_id)
        questions = models.Question.objects.filter(quiz=quiz_id)
        
        questions_data = []
        print(questions)
        for q in questions:
            question_data = {
                "id": q.id,
                "question": q.description,
                "answer": q.correct_answer,
                "is_multiple": q.is_multiple,
                "alternatives": None
            }
    
            if q.is_multiple:
                question_data["alternatives"] = {
                    "alt1": q.alt_1,
                    "alt2": q.alt_2,
                    "alt3": q.alt_3
                }
            questions_data.append(question_data)
        return questions_data
    except Exception as e:
        print(f"Error fetching quiz questions: {e}")
        return None


def change_quiz_attempt(attempt_id, ended_at=None, passed=False):
    attempt = models.QuizAttempt.objects.filter(id=attempt_id).first()
    if not attempt:
        print(f"No quiz attempt found with ID: {attempt_id}")
        return None
    
    try:
        if ended_at is not None:
            attempt.ended_at = ended_at
        attempt.passed = passed
        attempt.save()
        return attempt 
    except Exception as e:
        print(f"Error updating quiz attempt: {e}")
        return None