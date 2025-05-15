'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/credentials-create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "email": email, "password": password, "username": username }),
            })

        if (res.ok) {
            router.push('/')
        } else {
            const data = await res.json()
            setError(data.detail || 'Registration failed.')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Register</h1>

            <form onSubmit={handleRegister} className="grid grid-cols-1 gap-4 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                />
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
                <button type="submit" className="bg-green-600 text-white p-2 rounded">
                    Register
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>

            <p className="mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 underline">
                    Sign in here
                </a>
            </p>
        </div>
    )
}
