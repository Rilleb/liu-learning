
"use client"

import { useState, useEffect } from "react"
import { useGameSocket } from "../sockets/gameSocketContext"
import LandingPage from "./landingPage"
import GamePage from "./gamePage"
import { Question } from "@/app/data_types/data_types"
import { time } from "console"

interface params {
  gameId: string
  isRoomOwner: boolean
}

export default function GameHandeler({ gameId, isRoomOwner }: params) {
  const { socket, ready } = useGameSocket()
  const [gameStarted, setGameStarted] = useState(false)
  const [quiz, setQuiz] = useState(-1) //Set as -1 since -1 can't be a quiz-id
  const [questions, setQuestions] = useState<Question[]>([])
  const [timelimit, setTimelimit] = useState(0)

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "game_start") {
          setQuiz(data.quiz)
          setQuestions(data.questions)
          setTimelimit(data.timelimit)
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
      {!gameStarted && (<LandingPage gameId={gameId} isRoomOwner={isRoomOwner} />)}
      {gameStarted && <GamePage gameStarted={gameStarted} quiz={quiz} questions={questions} timelimit={timelimit} />}
    </>
  )
}

