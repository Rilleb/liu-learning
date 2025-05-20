import NextAuth from 'next-auth'

declare module 'next-auth' {
    interface Session {
        accessToken: string
        user: {
            id: number
            email?: string | null
            name?: string | null
            username: string
        }
    }

    interface User {
        id: number
        email?: string | null
        name?: string | null
        username: string
        accessToken: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string
        id: number
        username: string
    }
}
