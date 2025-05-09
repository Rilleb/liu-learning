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


def create_quiz_attempt(user, quiz, started_at=None, ended_at=None, passed=False):
    try:
        return internal_services.create_quiz_attempt(
            user, quiz, started_at, ended_at, passed
        )
    except Exception as e:
        print(f"Error creating quiz attempt: {e}")
        return None


def create_quiz_answer(
    attempt,
    question,
    is_correct,
    multiple_choice_answer=False,
    free_text_answer="",
    started_at=None,
    ended_at=None,
):
    try:
        return internal_services.create_quiz_answer(
            attempt,
            question,
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
        friendships = models.Friendship.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).distinct()
        friends = [f.user2 if f.user1 == user else f.user1 for f in friendships]
        return friends
    except Exception as e:
        print(f"Could not get friends, error: {e}")
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
        attempts_by_quiz = defaultdict(int)
        attempts_by_course = defaultdict(int)
        for attempt in attempts:
            if attempt.passed:
                daily_sucess[attempt.date_only] += 1
            daily_counts[attempt.date_only] += 1
            duration = (
                attempt.attempt_ended_at - attempt.attempt_started_at
            ).total_seconds()
            daily_time_spent[attempt.date_only] += duration
            attempts_by_quiz[attempt.quiz.id] += 1
        quiz_ids = attempts_by_quiz.keys()
        quizzes = models.Quiz.objects.filter(id__in=quiz_ids).select_related("course")
        quiz_to_course = {}
        for quiz in quizzes:
            quiz_to_course[quiz.id] = quiz.course.name

        for id, nr_of_attempts in attempts_by_quiz.items():
            attempts_by_course[quiz_to_course[id]] += nr_of_attempts

        cumulative = []
        total = 0
        successfull = 0
        for d in sorted(daily_counts.keys()):
            total += daily_counts[d]
            successfull += daily_sucess[d]
            cumulative.append(
                {
                    "date": d,
                    "user_total_attempts": total,
                    "user_successfull_attempts": successfull,
                    "user_ratio": successfull
                    / total,  # Ratio of successfull vs number tried
                    "user_total_time_spent": daily_time_spent[d],
                }
            )
        attempts_by_course = [
            {"course": k, "attempts": v} for k, v in attempts_by_course.items()
        ]
        return {"date_based": cumulative, "course_based": attempts_by_course}
    except Exception as e:
        print(f"Could not get statisics, Error: {e}")
        return None


def get_combined_quiz_statistics(user, friend):
    def collect_attempts(u):
        attempts = (
            models.QuizAttempt.objects.filter(user=u)
            .annotate(date_only=Cast("attempt_ended_at", output_field=DateField()))
            .order_by("date_only")
        )
        date_stats = defaultdict(
            lambda: {
                "total_attempts": 0,
                "successfull_attempts": 0,
                "total_time_spent": 0.0,
            }
        )
        quiz_counts = defaultdict(int)

        for attempt in attempts:
            date = attempt.date_only
            date_stats[date]["total_attempts"] += 1
            if attempt.passed:
                date_stats[date]["successfull_attempts"] += 1
            duration = (
                attempt.attempt_ended_at - attempt.attempt_started_at
            ).total_seconds()
            date_stats[date]["total_time_spent"] += duration
            quiz_counts[attempt.quiz_id] += 1

        return date_stats, quiz_counts

    # Collect stats for both users
    user_dates, user_quiz_counts = collect_attempts(user)
    friend_dates, friend_quiz_counts = collect_attempts(friend)

    # Merge date-based stats
    all_dates = set(user_dates.keys()) | set(friend_dates.keys())
    combined_date_stats = []
    for d in sorted(all_dates):
        u = user_dates.get(d, {})
        f = friend_dates.get(d, {})
        u_total = u.get("total_attempts", 0)
        f_total = f.get("total_attempts", 0)
        u_success = u.get("successfull_attempts", 0)
        f_success = f.get("successfull_attempts", 0)
        u_time = u.get("total_time_spent", 0.0)
        f_time = f.get("total_time_spent", 0.0)

        combined_date_stats.append(
            {
                "date": d,
                "user_total_attempts": u_total,
                "friend_total_attempts": f_total,
                "user_successful_attempts": u_success,
                "friend_successful_attempts": f_success,
                "user_ratio": u_success / u_total if u_total else 0,
                "friend_ratio": f_success / f_total if f_total else 0,
                "user_time_spent": u_time,
                "friend_time_spent": f_time,
            }
        )

    # Map quizzes to course names
    all_quiz_ids = set(user_quiz_counts.keys()) | set(friend_quiz_counts.keys())
    quiz_to_course = {
        q.id: q.course.name
        for q in models.Quiz.objects.filter(id__in=all_quiz_ids).select_related(
            "course"
        )
    }

    # Merge course-based stats
    course_stats = defaultdict(lambda: {"user_attempts": 0, "friend_attempts": 0})
    for quiz_id, count in user_quiz_counts.items():
        course = quiz_to_course.get(quiz_id)
        if course:
            course_stats[course]["user_attempts"] += count
    for quiz_id, count in friend_quiz_counts.items():
        course = quiz_to_course.get(quiz_id)
        if course:
            course_stats[course]["friend_attempts"] += count

    combined_course_stats = [{"course": c, **v} for c, v in course_stats.items()]

    return {
        "date_based": combined_date_stats,
        "course_based": combined_course_stats,
    }


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


def is_friend_with(user, friend_id):
    try:
        return models.Friendship.objects.filter(
            (Q(user1=user) & Q(user2__id=friend_id))
            | (Q(user1__id=friend_id) & Q(user2=user))
        ).exists()
    except Exception as e:
        print(f"Could not check friendship: {e}")
        return False
