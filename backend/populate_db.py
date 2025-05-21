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


#  Envariabel course
# ------------------------------
course = create_course(
    "Envariabel Analys",
    "TATA41",
    "Course that covers analysis with one variable",
    users[0],
)

chapter_1 = create_chapter("Limits", course, users[0])
chapter_2 = create_chapter("Derivates", course, users[0])

quiz_1 = create_quiz(
    "Basic limits",
    course,
    chapter_1,
    users[0],
    "This quiz will test your basic knowledge of limits, free-text and multiple-choice",
)
quiz_2 = create_quiz(
    "Advanced Derivitives",
    course,
    chapter_2,
    users[0],
    "These are some of the hardest derivates I know, quiz contains only free text answers",
)

quiz_1_questions = [
    create_question(quiz_1, "sin(x)/x , x->0", 1, False, "1"),
    create_question(
        quiz_1, "sin(x)/x , x->infinity", 2, True, "0", "1", "-1", "infinity"
    ),
]

quiz_2_questions = [
    create_question(quiz_2, "d/dx (2x^2)", 1, False, "4x"),
    create_question(quiz_2, "d/dx (sin(2x))", 2, False, "2cos(2x)"),
    create_question(quiz_2, "d/dx (ln(x))", 3, False, "1/x"),
    create_question(quiz_2, "d/dx (-x^(-1))", 4, False, "x^(-2)"),
]

# Create 10 quiz attempts for the first quiz on gustav, with him being faster and faster and passing after 5 attempts
for i in range(10):
    quiz_1_attempt = create_quiz_attempt(users[0], quiz_1)
    quiz_answers = [
        create_question_answer(quiz_1_attempt, quiz_1_questions[0], True, False, "1"),
        create_question_answer(quiz_1_attempt, quiz_1_questions[1], i > 5, True),
    ]
    quiz_1_attempt = change_quiz_attempt(
        quiz_1_attempt.id, datetime.now() + timedelta(seconds=300 - 10 * i), True
    )
# -----------------------------

# Create 10 quiz attempts for the first quiz on gustav, with him being faster and faster and passing after 5 attempts
for i in range(10):
    quiz_1_attempt = create_quiz_attempt(users[0], quiz_1)
    quiz_answers = [
        create_question_answer(quiz_1_attempt, quiz_1_questions[0], True, False, "1"),
        create_question_answer(quiz_1_attempt, quiz_1_questions[1], i > 5, True),
    ]
    quiz_1_attempt = change_quiz_attempt(
        quiz_1_attempt.id, datetime.now() + timedelta(seconds=300 - 10 * i), True
    )

#  Cybersecurity course
# ------------------------------
course = create_course(
    "Data Security",
    "TSIT02",
    "This is a course that gives basic understanding of data security",
    users[1],
)

chapter_1 = create_chapter("Web security", course, users[0])

quiz_1 = create_quiz(
    "Common attacks",
    course,
    chapter_1,
    users[1],
    "This quiz will test your basic knowledge of web security, multiple-choice questions only. Questions will describe an attack and your job is to identify the category",
)

quiz_1_questions = [
    create_question(
        quiz_1,
        "Executing/injecting javascript on a victims browser",
        1,
        True,
        "Cross-site scripting/XSS",
        "SQL-injection",
        "CSRF",
        "Directory traversal",
    ),
    create_question(
        quiz_1,
        "Gaining unauthorized database information via a text input",
        2,
        True,
        "SQL-injection",
        "Session hijacking",
        "Credential stuffing",
        "Broken access control",
    ),
    create_question(
        quiz_1,
        "Manually trying different passwords to gain access to someones account",
        3,
        True,
        "Brute-force attack",
        "Dictionary attack",
        "Credential stuffing",
        "Cryptographic failure",
    ),
]

# -----------------------------
# Follow courses
follow_course(users[0], course.id)
follow_course(users[1], course.id)
follow_course(users[2], course.id)

# Add friends
add_friend(users[0], users[1])  # gustav -> thea
add_friend(users[1], users[2])  # thea -> rickard
add_friend(users[2], users[0])  # rickard -> gustav
