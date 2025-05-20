
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
  className="flex items-center bg-white rounded-md px-3 py-1 w-full max-w-md border border-gray-300"
>
  <input
    type="text"
    name="name"
    placeholder="Search..."
    className="flex-grow px-3 py-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
  />
  <button
    type="submit"
    className="ml-2 p-2 rounded-md bg-[var(--foreground)] hover:bg-[var(--color3)] text-white transition-all duration-200 flex items-center justify-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
      />
    </svg>
  </button>
</form>


    )
}

export default function Header() {
    return (
        <div className="w-full bg-[var(--foreground)] h-16 flex items-center justify-between px-6">
            {/* Left section (can be empty or logo) */}
            <div className="w-1/3"></div>

            {/* Centered SearchBar */}
            <div className="w-1/3 flex justify-center">
                <SearchBar />
            </div>

            {/* Right-aligned profile icon */}
            <div className="w-1/3 flex justify-end">
                <Link href="/settings">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[var(--background)]"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                    </svg>
                </Link>
            </div>

            
        </div>
    )
}

