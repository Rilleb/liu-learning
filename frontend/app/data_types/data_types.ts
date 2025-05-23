export interface Course {
    id: number
    name: string
    code: string
    description: string
    created_by: User
    date_created: string // ISO date string, e.g., 2025-05-05T10:00:00Z
}

export interface Chapter {
    id: number
    name: string
    course: Course
    created_by: User
    date_created: string
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
    course: Course
    name: string
    chapter_id: number
    created_by: number
    date_created: string
    description: string
}

export interface Question {
    id: number
    description: string
    is_multiple: boolean
    correct_answer: string
    alt_1: string
    alt_2: string
    alt_3: string
}

export interface QuizAttempt {
    quiz: Quiz
    user: User
    start: Date
    end: Date
    passed: boolean
}

export interface DateBasedStat {
    date: Date
    user_total_attempts?: number
    friend_total_attempts?: number
    user_successful_attempts?: number
    friend_successful_attempts?: number
    user_ratio?: number
    friend_ratio?: number
    user_time_spent: number
    friend_time_spent?: number
}

export interface CourseBasedStat {
    course: string
    user_attempts: number
    friend_attempts?: number
}

export interface CombinedQuizStatistics {
    date_based: DateBasedStat[]
    course_based: CourseBasedStat[]
}

export type QuizList = Quiz[]
export type CourseList = Course[]
export type UserList = User[]

export interface FriendInvite {
    from: number
    from_username: string
    to: number
}

export type FriendInviteList = FriendInvite[]

export interface FriendsList {
    online: UserList
    offline: UserList
    invites: FriendInviteList
    refetch: boolean
}

export interface AccountInfo {
    name: string
    email: string
    created: Date
    course_count: number
    friend_count: number
}
