
"use client"

import { useState, useEffect } from "react"
import { useGameSocket } from "../sockets/gameSocketContext"
import LandingPage from "./landingPage"
import GamePage from "./gamePage"
import { Question } from "@/app/data_types/data_types"
import { time } from "console"
import { useSession } from "next-auth/react"

interface params {
  gameId: string
}

export default function GameHandeler({ gameId }: params) {
  const { socket, ready } = useGameSocket()
  const [gameStarted, setGameStarted] = useState(false)
  const [quiz, setQuiz] = useState(-1) //Set as -1 since -1 can't be a quiz-id
  const [questions, setQuestions] = useState<Question[]>([])
  const [timelimit, setTimelimit] = useState(0)
  const [restartButtonVisible, setRestartButtonVisible] = useState(false)
  const [isRoomOwner, setIsRoomOwner] = useState(false)
  const { data: session, status } = useSession()

  const handleClick = () => {
    setGameStarted(false)
    setRestartButtonVisible(false)
    socket?.send(JSON.stringify({ type: "restart_game" }))
  }

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
        } else if (data.type === "all_players_finished") {
          setRestartButtonVisible(true)
        } else if (data.type === "room_owner_changed" && data.owner_id === session?.user.id) {
          setIsRoomOwner(true)
        } else if (data.type == "restart_game") {
          setGameStarted(false)
        }
      } catch (err) {
        console.error("Error parsing socket message:", err)
      }
    }

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
      {gameStarted && <GamePage gameStarted={gameStarted} quiz={quiz} questions={questions} timelimit={timelimit} restartButtonVisible={restartButtonVisible} handleRestart={handleClick} isRoomOwner={isRoomOwner} />}
    </>
  )
}

