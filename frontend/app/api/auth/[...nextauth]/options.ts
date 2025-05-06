import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { AuthOptions } from 'next-auth'
import type { AuthenticatedUser } from '@/app/data_types/data_types'

export const options: AuthOptions = {
    pages: {
        signIn: '/login', // route to your custom page
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'Enter email',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const res = await fetch(
                    `${process.env.BACKEND_URL}/api/auth/credentials-login/`,
                    {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                const user = await res.json()
                console.log(user)

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return {
                        id: user.id,
                        email: user.email,
                        accessToken: user.access_token,
                    }
                }
                return null
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        // @ts-ignore
        async signIn({ user, account, profile }) {
            if (
                (account?.provider === 'google' ||
                    account?.provider === 'github') &&
                profile
            ) {
                const providerId = `${account.provider}|${profile.sub || profile.id}` //Google uses sub, github Id
                const res = await fetch(
                    `${process.env.BACKEND_URL}/api/auth/${account.provider === 'google' ? 'google' : 'github'}-login/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            sub: providerId,
                        }),
                    }
                )

                if (!res.ok) {
                    console.error('Failed to sync user to Django')
                    return null
                }

                const data = await res.json()
                const { access_token } = data
                if (data.access_token) {
                    user.accessToken = access_token // Attach the accessToken to the user object
                }

                return user
            }

            return user
        },
        // @ts-ignore
        async jwt({ token, user }) {
            // Check if user exists (i.e., first time the JWT callback is called)
            if (user) {
                token.accessToken = user.accessToken // Store accessToken in the token
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        },
    },
}
