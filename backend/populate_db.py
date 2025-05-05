from datetime import date
from django.contrib.auth.models import make_password
from db_handler.services import (
    create_user, create_course, create_chapter,
    create_quiz, create_question, mark_course_as_read,
    create_quiz_attempt, create_quiz_answer, add_friend
)

password = make_password("1234")

gustav = create_user("gstcc", "gustav@test.com", password)
thea = create_user("thea", "thea@test.com", password)
rille = create_user("rille", "rille@test.com", password)

course1 = create_course("Python", "tdde23", thea)
course2 = create_course("Neovim", "nvim101", rille)

chapter_1_course_1 = create_chapter("IO-functions", course1, gustav)
chapter_2_course_1 = create_chapter("terminal", course1, gustav)
chapter_1_course_2 = create_chapter("noob-stuff", course2, thea)


# Create quizzes for course 1
quiz_1_course_1 = create_quiz("Python Basics Quiz", course1, chapter_1_course_1, thea, "A beginner-level quiz about Python basics", date_created=date.today())
quiz_2_course_1 = create_quiz("Advanced Python Quiz", course1, chapter_2_course_1, gustav, "An advanced-level quiz for Python", date_created=date.today())

# Create quizzes for course 2
quiz_1_course_2 = create_quiz("Neovim Basics Quiz", course2, chapter_1_course_2, rille, "A basic quiz for Neovim", date_created=date.today())

# Create questions for quiz 1 of course 1
question_1_quiz_1_course_1 = create_question(quiz_1_course_1, "What is Python?", 1, is_multiple=False, correct_answer="A programming language")
question_2_quiz_1_course_1 = create_question(quiz_1_course_1, "What is the output of print(2 + 3)?", 2, is_multiple=False, correct_answer="5")
question_3_quiz_1_course_1 = create_question(quiz_1_course_1, "Which of the following is not a Python data type?", 3, is_multiple=True, alt_1="Integer", alt_2="String", alt_3="Character", correct_answer="Character")

# Create questions for quiz 2 of course 1
question_1_quiz_2_course_1 = create_question(quiz_2_course_1, "What is a list comprehension?", 1, is_multiple=False, correct_answer="A concise way to create lists")
question_2_quiz_2_course_1 = create_question(quiz_2_course_1, "How do you handle exceptions in Python?", 2, is_multiple=False, correct_answer="Using try-except blocks")

# Create a question for quiz 1 of course 2
question_1_quiz_1_course_2 = create_question(quiz_1_course_2, "What is Neovim?", 1, is_multiple=False, correct_answer="A text editor")

# Mark courses as read for each user
mark_course_as_read(gustav, course1)
mark_course_as_read(thea, course1)
mark_course_as_read(rille, course2)

# Add friends
add_friend(gustav, thea)
add_friend(thea, rille)
add_friend(rille, gustav)

# Creating quiz attempts for users
quiz_attempt_1_gustav = create_quiz_attempt(gustav, quiz_1_course_1, started_at=date.today(), ended_at=date.today(), passed=True)
quiz_attempt_2_thea = create_quiz_attempt(thea, quiz_2_course_1, started_at=date.today(), ended_at=date.today(), passed=False)

# Creating quiz answers for quiz attempts
create_quiz_answer(quiz_attempt_1_gustav, question_1_quiz_1_course_1, is_correct=True)
create_quiz_answer(quiz_attempt_1_gustav, question_2_quiz_1_course_1, is_correct=True)
create_quiz_answer(quiz_attempt_2_thea, question_1_quiz_2_course_1, is_correct=False)
create_quiz_answer(quiz_attempt_2_thea, question_2_quiz_2_course_1, is_correct=False)
