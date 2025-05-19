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
                className="absolute top-4 mx-2 w-6 h-6 flex items-center justify-center z-50"
                aria-label="Toggle Sidebar"
            >
                <div className="w-6 flex flex-col gap-1">
                    <span className="h-0.5 w-full bg-[var(--foreground)]"></span>
                    <span className="h-0.5 w-full bg-[var(--foreground)]"></span>
                    <span className="h-0.5 w-full bg-[var(--foreground)]"></span>
                </div>{' '}
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
