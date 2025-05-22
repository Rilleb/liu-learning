from django.utils import timezone
from .models import *


def create_user(username, email, password):
    user = User.objects.create_user(username=username, email=email, password=password)
    return user


def create_course(name, code, description, created_by, date_created=None):
    if date_created is None:
        date_created = timezone.now()
    course = Course.objects.create(
        name=name,
        code=code,
        description=description,
        created_by=created_by,
        date_created=date_created,
    )
    return course


def create_chapter(name, course, created_by, date_created=None):
    if date_created is None:
        date_created = timezone.now()
    chapter = Chapter.objects.create(
        name=name, course=course, created_by=created_by, date_created=date_created
    )
    return chapter


def create_quiz(name, course, chapter, created_by, description="", date_created=None):
    if date_created is None:
        date_created = timezone.now()
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
    correct_answer="",
    alt_1="",
    alt_2="",
    alt_3="",
):
    question = Question.objects.create(
        quiz=quiz,
        description=description,
        index=index,
        is_multiple=is_multiple,
        alt_1=alt_1,
        alt_2=alt_2,
        alt_3=alt_3,
        correct_answer=correct_answer,
    )
    return question


def add_friend(user1, user2):
    friends = Friendship.objects.create(user1=user1, user2=user2)
    return friends


def unfollow_course(user, course):
    followed_course = ReadCourse.objects.filter(user=user, course=course).first()
    if followed_course:
        followed_course.delete()
    return None


def follow_course(user, course):
    followed_course = ReadCourse.objects.filter(user=user, course=course).first()
    if not followed_course:
        followed_course = ReadCourse.objects.create(user=user, course=course)
    return followed_course


def create_quiz_attempt(user, quiz, ended_at=None, passed=False):
    started_at = timezone.now()
    if ended_at is None:
        ended_at = timezone.now()
    attempt = QuizAttempt.objects.create(
        user=user,
        quiz=quiz,
        attempt_started_at=started_at,
        attempt_ended_at=ended_at,
        passed=passed,
    )
    return attempt


def create_question_answer(
    attempt,
    question,
    is_correct,
    multiple_choice_answer=False,
    free_text_answer="",
    started_at=None,
    ended_at=None,
):
    if started_at is None:
        started_at = timezone.now()
    if ended_at is None:
        ended_at = timezone.now()
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


def create_friend_invite(from_friend, to):
    if from_friend and to:
        invite = FriendInvites.objects.create(from_friend=from_friend, to=to)
        return invite
    else:
        return None
