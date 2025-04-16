import { User, Course, Quiz } from '../data_types/data_types'

const userMap = new Map<number, User>([
    [
        1,
        {
            userId: 1,
            name: 'Alice',
            courses: [101, 205, 301, 1, 2, 3, 4],
            friends: [2, 3],
        },
    ],
    [
        2,
        {
            userId: 2,
            name: 'Bob',
            courses: [101, 301],
            friends: [1],
        },
    ],
    [
        3,
        {
            userId: 3,
            name: 'Rille',
            courses: [101],
            friends: [1, 2],
        },
    ],
])

const exampleCourses: Course[] = [
    {
        courseId: 101,
        title: 'Introduction to Computer Science',
        quizes: [1, 2, 3, 4],
        completedQuizes: [1, 2],
    },
    {
        courseId: 205,
        title: 'Advanced Data Structures',
        quizes: [5, 6, 7],
        completedQuizes: [5, 6, 7],
    },
    {
        courseId: 301,
        title: 'Machine Learning Fundamentals',
        quizes: [8, 9, 10, 11, 12],
        completedQuizes: [8, 9, 10],
    },
    {
        courseId: 1,
        title: 'Basic Mathematics for Computing',
        quizes: [13, 14],
        completedQuizes: [],
    },
    {
        courseId: 2,
        title: 'Basic Mathematics for Computing',
        quizes: [13, 14, 1, 2, 3],
        completedQuizes: [1, 2],
    },
    {
        courseId: 3,
        title: 'Basic Mathematics for Computing',
        quizes: [13, 14, 1, 2, 3],
        completedQuizes: [1, 2, 3],
    },
    {
        courseId: 4,
        title: 'Basic Mathematics for Computing',
        quizes: [13, 14, 1, 2, 3],
        completedQuizes: [1, 2, 3, 4],
    },
]

export const quizes: Quiz[] = [
    { quizId: 1, name: 'Introduction to Programming' },
    { quizId: 2, name: 'Variables and Data Types' },
    { quizId: 3, name: 'Control Structures' },
    { quizId: 4, name: 'Functions and Scope' },
    { quizId: 5, name: 'Object-Oriented Programming' },
    { quizId: 6, name: 'Arrays and Collections' },
    { quizId: 7, name: 'Error Handling' },
    { quizId: 8, name: 'Asynchronous Programming' },
    { quizId: 9, name: 'Databases and SQL Basics' },
    { quizId: 10, name: 'Web Development Basics' },
    { quizId: 11, name: 'Version Control with Git' },
    { quizId: 12, name: 'Testing and Debugging' },
    { quizId: 13, name: 'Software Design Patterns' },
    { quizId: 14, name: 'Final Project Quiz' },
]

export function get_user(userId: number) {
    return userMap.get(userId)
}

export function get_courses(userId: number): Course[] {
    const user = get_user(userId)
    const courseIds = user?.courses
    if (courseIds) {
        return exampleCourses.filter((course) =>
            courseIds.includes(course.courseId)
        )
    } else {
        return []
    }
}

export function get_latest_quizes(numberOf: number): Quiz[] {
    return quizes.slice(0, numberOf)
}
