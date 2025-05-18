
"use client";

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/app/components/header'
import Navbar from '@/app/components/navbar'
import SessionProviderWrapper from './components/SessionProviderWrapper'
import WebSocketConnector from '@/app/components/sockets/webSocketConnector'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'
import { useRef } from 'react'
import 'react-tooltip/dist/react-tooltip.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Provider store={storeRef.current}>
                    <SessionProviderWrapper>
                        <WebSocketConnector>
                            <Header />
                            <div className="flex h-screen w-full overflow-hidden">
                                <Navbar />
                                <main className="flex-1 overflow-auto p-6">{children}</main>
                            </div>
                        </WebSocketConnector>
                    </SessionProviderWrapper>
                </Provider>
            </body>
        </html>
    )
}

