'use client'
import { createContext, useContext } from 'react'

type GameSocketContextValue = {
    socket: WebSocket | null
    ready: boolean
}

export const GameSocketContext = createContext<
    GameSocketContextValue | undefined
>(undefined)

export const useGameSocket = () => {
    const context = useContext(GameSocketContext)
    if (!context)
        throw new Error(
            'useGameSocket must be used within a GameSocketProvider'
        )
    return context
}
