
"use client"

import { useState, useEffect } from "react"
import { useGameSocket } from "../sockets/gameSocketContext"
import LandingPage from "./landingPage"
import GamePage from "./gamePage"

interface params {
  gameId: string
}

export default function GameHandeler({ gameId }: params) {
  const { socket, ready } = useGameSocket()
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "game_start") {
          setGameStarted(true)
        }

      } catch (err) {
        console.error("Error parsing socket message:", err)
      }
    }

    // eventlisteners stacks instead of overwriting so we can define multiple hadnlers
    socket.addEventListener("message", handleMessage)

    return () => {
      socket.removeEventListener("message", handleMessage)
    }
  }, [socket])

  if (!ready) {
    return (<p>Loading...</p>)
  }

  return (
    <>
      {!gameStarted && (<LandingPage gameId={gameId} />)}
      {gameStarted && <GamePage />}
    </>
  )
}

