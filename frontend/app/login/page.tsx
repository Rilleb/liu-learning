
'use client'

import { getProviders, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
    const [providers, setProviders] = useState<Record<string, any> | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        getProviders().then(setProviders)
    }, [])

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/',
        })

        if (result?.ok) {
            window.location.href = result.url || '/'
        } else {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Sign In</h1>

            {/* Credentials Login Form */}
            <form onSubmit={handleCredentialsLogin} className="mt-4 space-y-4">
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Sign In
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>

            <div className="mt-6">
                <p>Or sign in with:</p>
                {providers &&
                    Object.values(providers)
                        .filter((p: any) => p.id !== 'credentials')
                        .map((provider: any) => (
                            <div key={provider.name} className="mt-2">
                                <button
                                    onClick={() => signIn(provider.id)}
                                    className="bg-gray-800 text-white px-4 py-2 rounded"
                                >
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        ))}
            </div>

            <p className="mt-4">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-500 underline">
                    Register here
                </Link>
            </p>
        </div>
    )
}

