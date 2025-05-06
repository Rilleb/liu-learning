from . import internal_services


def create_user(username, email, password):
    try:
        return internal_services.create_user(username, email, password)
    except Exception as e:
        print(f"Error creating user: {e}")
        return None


def create_course(name, code, description, created_by, date_created=None):
    try:
        return internal_services.create_course(
            name, code, description, created_by, date_created
        )
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
    multiple_choice_answer=None,
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
