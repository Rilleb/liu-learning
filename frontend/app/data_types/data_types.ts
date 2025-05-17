export interface Course {
    id: number
    name: string
    code: string
    created_by: User
    date_created: string // ISO date string, e.g., 2025-05-05T10:00:00Z
}

export interface User {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
    date_joined: string
    is_active: string
}

export interface Quiz {
    id: number
    course_id: number
    name: string
    chapter_id: number
    created_by: number
    date_created: string
    description: string
}

export interface Question {
    id: number
    question: string
    answer: string
    is_multiple: boolean
    alternatives: any
}

export interface QuizAttempt {
    quiz: Quiz
    user: User
    start: Date
    end: Date
    passed: boolean
}

export type QuizList = Quiz[]
export type CourseList = Course[]
export type FriendsList = FriendsList[]
export type UserList = User[]
