from .models import *
import datetime


def create_user(username, email, password):
    user = User.objects.create_user(username=username, email=email, password=password)
    return user


def create_course(name, code, created_by, date_created=None):
    if date_created is None:
        date_created = datetime.date.today()
    course = Course.objects.create(
        name=name, code=code, created_by=created_by, date_created=date_created
    )
    return course


def create_chapter(name, course, created_by, date_created=None):
    if date_created is None:
        date_created = datetime.date.today()
    chapter = Chapter.objects.create(
        name=name, course=course, created_by=created_by, date_created=date_created
    )
    return chapter


def create_quiz(name, course, chapter, created_by, description="", date_created=None):
    if date_created is None:
        date_created = datetime.date.today()
    quiz = Quiz.objects.create(
        name=name,
        course=course,
        chapter=chapter,
        created_by=created_by,
        description=description,
        date_created=date_created,
    )
    return quiz


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
    question = Question.objects.create(
        quiz=quiz,
        description=description,
        index=index,
        is_multiple=is_multiple,
        free_text_answer=free_text_answer,
        alt_1=alt_1,
        alt_2=alt_2,
        alt_3=alt_3,
        correct_answer=correct_answer,
    )
    return question


def add_friend(user1, user2):
    friends = Friendship.objects.create(user1=user1, user2=user2)
    return friends


def mark_course_as_read(user, course):
    read_course = ReadCourse.objects.create(user=user, course=course)
    return read_course


def create_quiz_attempt(user, quiz, started_at=None, ended_at=None, passed=False):
    if started_at is None:
        started_at = datetime.date.today()
    if ended_at is None:
        ended_at = datetime.date.today()
    attempt = QuizAttempt.objects.create(
        user=user,
        quiz=quiz,
        attempt_started_at=started_at,
        attempt_ended_at=ended_at,
        passed=passed,
    )
    return attempt


def create_quiz_answer(
    attempt,
    question,
    is_correct,
    multiple_choice_answer=False,
    free_text_answer="",
    started_at=None,
    ended_at=None,
):
    if started_at is None:
        started_at = datetime.date.today()
    if ended_at is None:
        ended_at = datetime.date.today()
    answer = QuizAnswer.objects.create(
        attempt=attempt,
        question=question,
        is_correct=is_correct,
        multiple_chooice_answer=multiple_choice_answer,
        free_text_answer=free_text_answer,
        attempt_started_at=started_at,
        attempt_ended_at=ended_at,
    )
    return answer
