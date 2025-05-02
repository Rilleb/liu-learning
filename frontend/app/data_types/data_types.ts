import { User } from 'next-auth'

/*Basic example on how a course might look*/
export interface Course {
    courseId: number
    title: string
    quizes: number[]
    completedQuizes: number[]
}

/*Basic example of how a user might look*/
export interface Users {
    userId: number
    name: string
    courses: number[]
    friends: number[]
}

export interface Quiz {
    name: string
    quizId: number
}

export interface AuthenticatedUser extends User {
    accessToken?: string
    refreshToken?: string
}
