"use client"

import { Question } from "@/app/data_types/data_types"
import { useEffect, useState } from "react"
import GameQuizCard from "./gameQuizCard"
import { useSession } from "next-auth/react"
import StatusBar from "./status"
import { useGameSocket } from "../sockets/gameSocketContext"

interface Params {
  gameStarted: boolean
  quiz: number
  questions: Question[]
  timelimit: number
  restartButtonVisible: boolean
  handleRestart: () => void
  isRoomOwner: boolean
}

export default function GamePage({ gameStarted, quiz, questions, timelimit, restartButtonVisible, handleRestart, isRoomOwner }: Params) {
  const [remainingTime, setRemainingTime] = useState<number>(timelimit)
  const { data: session, status } = useSession()
  const [quizAttemptId, setQuizAttemptId] = useState(-1)
  const [showDoneScreen, setShowDoneScreen] = useState(false)
  const { socket, ready } = useGameSocket()
  const [podium, setPodium] = useState<string[]>([])


  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "podium_updated") {
          setPodium(data.podium)
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    console.log("Game started, start timer", gameStarted)

    const startGame = async () => {
      if (gameStarted) {
        setRemainingTime(4)

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz_attempt/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${session?.accessToken}`,
            },
            body: JSON.stringify({ quiz_id: quiz })
          })

          if (res.ok) {
            const data = await res.json()
            setQuizAttemptId(data.attempt_id)
          } else {
            console.error("Failed to create quiz attempt")
          }
        } catch (err) {
          console.error("Error during quiz attempt fetch:", err)
        }

        timer = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    startGame()

    return () => clearInterval(timer)
  }, [gameStarted])

  const handleDone = async (passed: boolean) => {
    setShowDoneScreen(true)
    console.log("Passed?", passed)
    if (!socket) {
      return
    }
    socket.send(JSON.stringify({ "type": "user_finished", "user": session?.user.username }))
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz_attempt/change`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          attempt_id: quizAttemptId,

          ended_at: new Date(Date.now()).toISOString(),
          passed,
        }),
      });

      if (!res.ok) {
        console.error("Something went wrong")
      }


    } catch (err) {
      console.error(`Something went wrong, error: ${err}`)
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-6xl px-4">
        {!showDoneScreen ? (
          <>
            <div className="flex-1 p-6 rounded shadow text-center space-y-4 bg-white">
              {gameStarted && remainingTime !== 0 ? (
                <div>
                  <p className="text-lg text-gray-700">Time Remaining:</p>
                  <p className="text-4xl font-mono text-blue-600">{remainingTime}s</p>
                </div>
              ) : (
                <GameQuizCard
                  questions={questions}
                  quiz_id={quiz}
                  quiz_attempt_id={quizAttemptId}
                  name="tmp"
                  handleDone={handleDone}
                  timelimit={timelimit}
                />
              )}
            </div>

            <div className="w-64 ml-6">
              <StatusBar />
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded shadow text-center flex-1">
            <h2 className="text-2xl font-bold text-green-700 mb-6">You are done!</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Top 3 Players</h3>

            <div className="flex justify-center items-end space-x-4 h-48 mb-6">
              <div className="flex flex-col items-center">
                <div className="bg-gray-300 w-16 h-24 rounded-t-md flex items-center justify-center text-lg font-semibold">
                  🥈
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">{podium[1] || "—"}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-yellow-400 w-16 h-32 rounded-t-md flex items-center justify-center text-lg font-semibold">
                  🥇{/*Took these of internet, I hope all browsers can display them :) */}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-800">{podium[0] || "—"}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-orange-300 w-16 h-20 rounded-t-md flex items-center justify-center text-lg font-semibold">
                  🥉
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">{podium[2] || "—"}</span>
              </div>
            </div>

            {restartButtonVisible && isRoomOwner && (
              <button
                onClick={handleRestart}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
              >
                Restart Game
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

}

