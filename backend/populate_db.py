from datetime import datetime, date, timedelta, time
from django.utils import timezone
import random
from db_handler.services import (
    change_quiz_attempt,
    create_user,
    follow_course,
    add_friend,
)
from db_handler.internal_services import (
    create_course,
    create_chapter,
    create_quiz,
    create_quiz_attempt,
    create_question,
    create_question_answer,
)

password = "1234"
users = [
    create_user("gustav", "gustav@test.com", password),
    create_user("thea", "thea@test.com", password),
    create_user("rickard", "rickard@test.com", password),
]

num_courses = 3

#  Envariabel course
# ------------------------------
envariabel_analys = create_course(
    "Envariabel Analys",
    "TATA41",
    "Kurs som behandlar analyser av en variabel",
    users[0],
)

chapter_1 = create_chapter("Gränsvärden", envariabel_analys, users[0])

quiz_1 = create_quiz(
    "Grundläggande gränsvärden",
    envariabel_analys,
    chapter_1,
    users[0],
    "Detta quiz testar dina grundläggande kunskaper om gränsvärden",
)

quiz_1_questions = [
    create_question(quiz_1, "sin(x)/x , x->0", 1, False, "1"),
    create_question(
        quiz_1, "sin(x)/x , x->infinity", 2, True, "0", "1", "-1", "infinity"
    ),
]

quiz_1_attempt = create_quiz_attempt(users[0], quiz_1)
quiz_answers = [
    create_question_answer(quiz_1_attempt, quiz_1_questions[0], True, False, "1"),
    create_question_answer(quiz_1_attempt, quiz_1_questions[1], True, True),
]
quiz_1_attempt = change_quiz_attempt(
    quiz_1_attempt.id, datetime.now() + timedelta(seconds=300), True
)
# -----------------------------

# More courses...

# Follow courses
follow_course(users[0], envariabel_analys.id)
follow_course(users[1], envariabel_analys.id)
follow_course(users[2], envariabel_analys.id)

# Add friends
add_friend(users[0], users[1])  # gustav -> thea
add_friend(users[1], users[2])  # thea -> rickard
add_friend(users[2], users[0])  # rickard -> gustav
