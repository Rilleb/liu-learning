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

export const quizes: Quiz[] = [
    { quizId: 1, name: 'Introduction to Programming', courseId: 101 },
    { quizId: 2, name: 'Variables and Data Types', courseId: 101 },
    { quizId: 3, name: 'Control Structures', courseId: 101 },
    { quizId: 4, name: 'Functions and Scope', courseId: 101 },
    { quizId: 5, name: 'Object-Oriented Programming', courseId: 205 },
    { quizId: 6, name: 'Arrays and Collections', courseId: 205 },
    { quizId: 7, name: 'Error Handling', courseId: 205 },
    { quizId: 8, name: 'Asynchronous Programming', courseId: 301 },
    { quizId: 9, name: 'Databases and SQL Basics', courseId: 301 },
    { quizId: 10, name: 'Web Development Basics', courseId: 301 },
    { quizId: 11, name: 'Version Control with Git', courseId: 301 },
    { quizId: 12, name: 'Testing and Debugging', courseId: 301 },
    { quizId: 13, name: 'Software Design Patterns', courseId: 1 },
    { quizId: 14, name: 'Final Project Quiz', courseId: 1 },
    // Reused quizzes for other courses
    { quizId: 13, name: 'Software Design Patterns', courseId: 2 },
    { quizId: 14, name: 'Final Project Quiz', courseId: 2 },
    { quizId: 1, name: 'Introduction to Programming', courseId: 2 },
    { quizId: 2, name: 'Variables and Data Types', courseId: 2 },
    { quizId: 3, name: 'Control Structures', courseId: 2 },
    // And so on for other course reuses...
];

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

export function get_course_name(courseId: number): String {
    const course = exampleCourses.find(c => c.courseId === courseId);
    return course?.title ||" ";
}

export function getQuizzesForCourse(courseId: number): Quiz[] {
    console.log(courseId)
    return quizes.filter(quiz => quiz.courseId === courseId);
}