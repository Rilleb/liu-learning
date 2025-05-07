import NextAuth from 'next-auth'
import { Session } from 'next-auth'

// Extend the default Session type
declare module 'next-auth' {
    interface Session {
        accessToken: string // Define the `accessToken` field here
    }
}
