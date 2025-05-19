"use client"

import { Question } from "@/app/data_types/data_types"
import { useEffect, useState } from "react"
import GameQuizCard from "./gameQuizCard"
import { useSession } from "next-auth/react"
import StatusBar from "./status"

interface Params {
  gameStarted: boolean
  quiz: number
  questions: Question[]
  timelimit: number
}

export default function GamePage({ gameStarted, quiz, questions, timelimit }: Params) {
  const [remainingTime, setRemainingTime] = useState<number>(timelimit)
  const { data: session, status } = useSession()
  const [quizAttemptId, setQuizAttemptId] = useState(-1)
  const [showDoneScreen, setShowDoneScreen] = useState(false)


  useEffect(() => {
    let timer: NodeJS.Timeout
    console.log("Game started, start timer", gameStarted)

    const startGame = async () => {
      if (gameStarted) {
        setRemainingTime(5)

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

  const handleDone = () => {
    setShowDoneScreen(true)
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-6xl px-4">
        {!showDoneScreen ? (
          <>
            {/* Left column: Main content */}
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
                />
              )}
            </div>

            <div className="w-64 ml-6">
              <StatusBar />
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded shadow text-center flex-1">
            <h2 className="text-2xl font-bold text-green-700">🎉 You are done!</h2>
          </div>
        )}
      </div>
    </div>
  )

}

