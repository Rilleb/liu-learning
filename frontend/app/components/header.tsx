
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FormEvent } from 'react'

function SearchBar() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/search', {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()
        //Display the result
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center bg-white rounded-full px-4 py-1 shadow-md w-full max-w-md"
        >
            <input
                type="text"
                name="name"
                placeholder="Search..."
                className="flex-grow px-3 py-2 outline-none bg-transparent"
            />
            <button
                type="submit"
                className="text-white bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full transition-all"
            >
                Search
            </button>
        </form>
    )
}

export default function Header() {
    return (
        <div className="w-full shadow-md bg-[var(--foreground)] h-16 flex items-center justify-between px-6">
            {/* Left section (can be empty or logo) */}
            <div className="w-1/3"></div>

            {/* Centered SearchBar */}
            <div className="w-1/3 flex justify-center">
                <SearchBar />
            </div>

            {/* Right-aligned profile icon */}
            <div className="w-1/3 flex justify-end">
                <Link href="/settings">
                    <Image
                        src="/globe.svg"
                        width={30}
                        height={30}
                        alt="profile picture"
                        className="cursor-pointer"
                    />
                </Link>
            </div>

        </div>
    )
}

