from datetime import datetime, date, timedelta, time
from django.utils import timezone
import random
from db_handler.services import (
    create_user,
    create_course,
    create_chapter,
    create_quiz,
    create_question,
    mark_course_as_read,
    create_quiz_attempt,
    create_quiz_answer,
    add_friend,
)

password = "1234"
users = [create_user(f"user{i}", f"user{i}@test.com", password) for i in range(5)]
num_courses = 10
courses = []
chapters = []
quizzes = []
questions_by_quiz = {}

# Create courses, chapters, quizzes, and questions
for i in range(num_courses):
    owner = random.choice(users)
    course = create_course(f"Course {i}", f"CODE{i}", owner)
    courses.append(course)

    chapter = create_chapter(f"Chapter {i}", course, owner)
    chapters.append(chapter)

    for j in range(random.randint(1, 3)):
        quiz = create_quiz(
            f"Quiz {i}-{j}",
            course,
            chapter,
            owner,
            f"Description for Quiz {i}-{j}",
            date_created=date.today(),
        )
        quizzes.append(quiz)

        questions = []
        for k in range(random.randint(2, 4)):
            q = create_question(
                quiz,
                f"Question {k} for Quiz {i}-{j}",
                k + 1,
                is_multiple=False,
                correct_answer="Correct",
            )
            questions.append(q)
        questions_by_quiz[quiz] = questions

# Mark all users as having read all courses
for user in users:
    for course in courses:
        mark_course_as_read(user, course)

# Add all users as friends with each other
for i, user in enumerate(users):
    for other_user in users[i + 1 :]:
        add_friend(user, other_user)
        add_friend(other_user, user)


def random_time_on_day(day):
    hour = random.randint(8, 22)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return datetime.combine(day, time(hour, minute, second))


# Create attempts for each user on random quizzes
for i in range(50):
    day = date.today() - timedelta(days=i)
    started_at = timezone.make_aware(random_time_on_day(day))
    ended_at = started_at + timedelta(seconds=random.randint(60, 600))

    user = random.choice(users)
    quiz = random.choice(quizzes)
    passed = random.choice([True, False])

    attempt = create_quiz_attempt(user, quiz, started_at, ended_at, passed)

    for question in questions_by_quiz[quiz]:
        create_quiz_answer(attempt, question, is_correct=passed)
