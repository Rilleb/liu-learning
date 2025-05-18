'use client'

import { createContext, useContext } from 'react'

type SocketContextValue = {
    socket: WebSocket | null
    ready: boolean
}

export const SocketContext = createContext<SocketContextValue>({
    socket: null,
    ready: false,
})

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}
