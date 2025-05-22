from django.contrib.auth import get_user, get_user_model
from collections import defaultdict
from django_redis import get_redis_connection
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


def create_course(name, code, description, created_by, chapters, date_created=None):
    try:
        course = internal_services.create_course(
            name, code, description, created_by, date_created
        )
        for chapter in chapters:
            internal_services.create_chapter(chapter, course, created_by, date_created)

        return course
    except Exception as e:
        print(f"Error creating course: {e}")
        return None


def create_quiz(
    name,
    course_id,
    chapter_id,
    description,
    questions,
    answerTypes,
    answers,
    created_by_user,
    date_created=None,
):
    try:
        course = models.Course.objects.get(id=course_id)
        chapter = models.Chapter.objects.get(id=chapter_id)

        quiz = internal_services.create_quiz(
            name, course, chapter, created_by_user, description, date_created
        )
        for i in range(len(questions)):
            is_multiple = answerTypes[i] == "multiple-choice"
            if is_multiple:
                internal_services.create_question(
                    quiz,
                    questions[i],
                    i,
                    is_multiple,
                    answers[i][0],
                    answers[i][1],
                    answers[i][2],
                    answers[i][3],
                )
            else:
                internal_services.create_question(
                    quiz,
                    questions[i],
                    i,
                    is_multiple,
                    answers[i][0],
                )

        return quiz
    except Exception as e:
        print(f"Error creating quiz: {e}")
        return None


def get_course_chapters(course_id):
    try:
        related_course = models.Course.objects.filter(id=course_id).first()
        return models.Chapter.objects.filter(course=related_course)
    except Exception as e:
        print(f"Error getting course chapters: {e}")
        return None


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
    try:
        return internal_services.create_question(
            quiz,
            description,
            index,
            is_multiple,
            correct_answer,
            alt_1,
            alt_2,
            alt_3,
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


def follow_course(user, course_id):
    try:
        course = models.Course.objects.get(id=course_id)
        return internal_services.follow_course(user, course)
    except Exception as e:
        print(f"Error when trying to follow course: {e}")
        return None


def unfollow_course(user, course_id):
    try:
        course = models.Course.objects.get(id=course_id)
        return internal_services.unfollow_course(user, course)
    except Exception as e:
        print(f"Error when trying to unfollowing course: {e}")
        return None


def create_quiz_attempt(user, quiz, ended_at=None, passed=False):
    try:
        actual_quiz = models.Quiz.objects.filter(id=quiz).first()
        return internal_services.create_quiz_attempt(
            user, actual_quiz, ended_at, passed
        )
    except Exception as e:
        print(f"Error creating quiz attempt: {e}")
        return None


def create_question_answer(
    attempt_id,
    question_id,
    is_correct,
    multiple_choice_answer=False,
    free_text_answer="",
    started_at=None,
    ended_at=None,
):
    try:
        actual_attempt = models.QuizAttempt.objects.filter(id=attempt_id).first()
        actual_question = models.Question.objects.filter(id=question_id).first()
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


def create_friend_invite(from_friend, to):
    try:
        return internal_services.create_friend_invite(from_friend=from_friend, to=to)
    except Exception as e:
        print(f"Error creating friend invite: {e}")


User = get_user_model()


def get_courses(user):
    try:
        courses = models.Course.objects.filter(readcourse__user=user)
        print("Courses", courses)
        return courses
    except Exception as e:
        print(f"Error fetching followed courses: {e}")
        return None


def get_all_courses():
    try:
        courses = models.Course.objects.all()
        return courses
    except Exception as e:
        print(f"Error fetching all courses: {e}")
        return None


def get_course_by_id(course_id):
    try:
        course = models.Course.objects.get(id=course_id)
        return course
    except Exception as e:
        print(f"Error fetching course by id: {e}")
        return None


def get_courses_by_query(query):
    try:
        if query:
            courses = models.Course.objects.filter(
                Q(name__icontains=query) | Q(code__icontains=query)
            )[:4]
        else:
            courses = models.Course.objects.all()[:4]
        return courses
    except Exception as e:
        print(f"Error fetching courses by query: {e}")
        return None


def get_quizzes(user):
    try:
        quizes = models.Quiz.objects.filter(
            course__in=models.ReadCourse.objects.filter(user=user).values("course_id")
        )
        return quizes
    except Exception as e:
        print(f"Could not get quizes: {e}")
        return None


def get_quizzes_by_course(course_id):
    try:
        course = models.Course.objects.filter(id=course_id).first()
        quizzes = models.Quiz.objects.filter(course=course)

        return quizzes
    except Exception as e:
        print(f"Error creating quiz answer: {e}")
        return None


def get_quiz_by_id(quiz_id):
    try:
        quiz = models.Quiz.objects.get(id=quiz_id)
        return quiz
    except Exception as e:
        print(f"Error fetching course by id: {e}")
        return None


def get_quizzes_by_query(query):
    try:
        if query:
            quizzes = models.Quiz.objects.filter(Q(name__icontains=query))[:4]
        else:
            quizzes = models.Course.objects.all()[:4]
        return quizzes
    except Exception as e:
        print(f"Error fetching quizzes by query: {e}")
        return None


def is_user_online(user_id):
    conn = get_redis_connection("default")
    return conn.sismember("online_users", user_id)


def get_friends(user):
    try:
        friendships = models.Friendship.objects.filter(
            Q(user1=user) | Q(user2=user)
        ).distinct()
        friends = [f.user2 if f.user1 == user else f.user1 for f in friendships]
        online = []
        offline = []
        for f in friends:
            if is_user_online(f.id):
                online.append(f)
            else:
                offline.append(f)

        return offline, online
    except Exception as e:
        print(f"Could not get friends, error: {e}")
        return None


def get_quiz_description(quiz_id):
    try:
        description = models.Quiz.objects.filter(id=quiz_id).first().description
        return description
    except Exception as e:
        print(f"Could not get quiz description: {e}")
        return None


def get_quiz_name(quiz_id):
    try:
        name = models.Quiz.objects.filter(id=quiz_id).first().name
        return name
    except Exception as e:
        print(f"Could not get quiz name: {e}")
        return None


def get_question_count(quiz_id):
    try:
        count = models.Question.objects.filter(quiz_id=quiz_id).count()
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
                    "user_ratio": float(successfull)
                    / total,  # Ratio of successfull vs number tried
                    "user_time_spent": daily_time_spent[d],
                }
            )
            print(
                f"Date: {d}, Total: {total}, Success: {successfull}, Ratio: {successfull / total}"
            )
        attempts_by_course = [
            {"course": k, "user_attempts": v} for k, v in attempts_by_course.items()
        ]
        return {"date_based": cumulative, "course_based": attempts_by_course}
    except Exception as e:
        print(f"Could not get statisics, Error: {e}")
        return None


def get_combined_quiz_statistics(user, friend):
    user_stats = get_quiz_statistics(user)
    friend_stats = get_quiz_statistics(friend)

    if not user_stats or not friend_stats:
        return None

    # Merge date_based
    date_dict = {}

    # Add user data to the date_dict
    for entry in user_stats["date_based"]:
        date = entry["date"]
        date_dict[date] = {
            "date": date,
            "user_total_attempts": entry.get("user_total_attempts", None),
            "user_successfull_attempts": entry.get("user_successfull_attempts", None),
            "user_ratio": entry.get("user_ratio", None),
            "user_time_spent": entry.get("user_time_spent", None),
            "friend_total_attempts": None,
            "friend_successfull_attempts": None,
            "friend_ratio": None,
            "friend_time_spent": None,
        }

    # Add friend data to the date_dict
    for entry in friend_stats["date_based"]:
        date = entry["date"]
        if date not in date_dict:
            date_dict[date] = {
                "date": date,
                "user_total_attempts": None,
                "user_successfull_attempts": None,
                "user_ratio": None,
                "user_time_spent": None,
            }

        # Merge the friend's data
        date_dict[date]["friend_total_attempts"] = entry.get(
            "user_total_attempts", None
        )
        date_dict[date]["friend_successfull_attempts"] = entry.get(
            "user_successfull_attempts", None
        )
        date_dict[date]["friend_ratio"] = entry.get("user_ratio", None)
        date_dict[date]["friend_time_spent"] = entry.get("user_time_spent", None)

    # Sort the dates
    combined_date_based = sorted(date_dict.values(), key=lambda x: x["date"])

    # Merge course_based
    course_dict = {}

    # Add user course data to the course_dict
    for entry in user_stats["course_based"]:
        course = entry["course"]
        course_dict[course] = {
            "course": course,
            "user_attempts": (
                entry.get("user_attempts", 0)
                if entry.get("user_attempts", 0) > 0
                else 0
            ),
            "friend_attempts": 0,
        }

    # Add friend course data to the course_dict
    for entry in friend_stats["course_based"]:
        course = entry["course"]
        if course not in course_dict:
            course_dict[course] = {
                "course": course,
                "user_attempts": 0,
            }

        course_dict[course]["friend_attempts"] = (
            entry.get("user_attempts", 0) if entry.get("user_attempts", 0) > 0 else 0
        )

    # Convert to list
    combined_course_based = list(course_dict.values())

    return {
        "date_based": combined_date_based,
        "course_based": combined_course_based,
    }


def are_friends(user1, user2):
    friendship = models.Friendship.objects.filter(
        Q(user1=user1, user2=user2) | Q(user2=user1, user1=user2)
    ).first()
    return friendship


def find_friend(user, query):
    try:
        friendships = models.Friendship.objects.filter(Q(user1=user) | Q(user2=user))

        friend_ids = [
            f.user2.id if f.user1 == user else f.user1.id for f in friendships
        ]

        friends = User.objects.filter(id__in=friend_ids, username__icontains=query)[:5]

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
        questions = models.Question.objects.filter(quiz=quiz_id).all()
        return questions
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
            attempt.attempt_ended_at = ended_at
        attempt.passed = passed
        attempt.save()
        return attempt
    except Exception as e:
        print(f"Error updating quiz attempt: {e}")
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


def get_account_info(user_id):
    try:
        res = (
            models.User.objects.filter(id=user_id)
            .values("username", "email", "date_joined")
            .first()
        )
        print(res, "ndsonfkskegnpgkrwmgpeörmgmesrlgm")
        course_count = models.ReadCourse.objects.filter(user=user_id).count()

        friend_count = models.Friendship.objects.filter(
            (Q(user1=user_id) | Q(user2__id=user_id))
        ).count()

        account_data = {
            "name": res.get("username"),
            "email": res.get("email"),
            "created": res.get("date_joined"),
            "course_count": course_count,
            "friend_count": friend_count,
        }
        return account_data
    except Exception as e:
        print(f"Could not get course name: {e}")
        return None


def get_user_from_username(username):
    try:
        return models.User.objects.get(username=username)
    except User.DoesNotExist:
        return None


def get_friend_invites(user):
    invites = models.FriendInvites.objects.filter(to=user).select_related(
        "from_friend", "to"
    )
    return [
        {
            "from": invite.from_friend.id,
            "from_username": invite.from_friend.username,
            "to": invite.to.id,
        }
        for invite in invites
    ]


def has_pending_invite(from_friend, to) -> bool:
    return models.FriendInvites.objects.filter(from_friend=from_friend, to=to).exists()
