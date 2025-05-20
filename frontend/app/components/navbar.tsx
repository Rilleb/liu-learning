'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(true)
    const pathname = usePathname()

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/courses', label: 'Courses' },
        { href: '/create', label: 'Create' },
        { href: '/profile', label: 'Profile' },
        { href: '/game', label: "Play with friends" }
    ]

    return (
        <div
            className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} bg-[var(--color1)] h-screen relative`}
        >
            {/* Toggle Button */}
            <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Sidebar"
            className="absolute top-4 left-4 z-50 w-8 h-8 flex flex-col items-center justify-center space-y-[3px]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Nav Links */}
            <ul className="mt-16 p-4 space-y-4 text-lg">
                {navLinks.map(({ href, label }) => (
                    <li key={href}>
                        {isOpen && (
                            <Link
                                href={href}
                                className={`block px-2 py-1 rounded transition ${pathname === href
                                    ? 'bg-[var(--background)] font-bold'
                                    : 'hover:bg-[var(--color3)]'
                                    }`}
                            >
                                <span className="ml-2">{label}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
