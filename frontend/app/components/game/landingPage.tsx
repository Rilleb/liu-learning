"use client"

import { useEffect, useState } from "react"
import FriendsBar from "../friend_bar"
import { QuizList, Quiz } from "@/app/data_types/data_types"
import { useSession } from "next-auth/react"
import { useGameSocket } from "../sockets/gameSocketContext"

interface params {
  gameId: string
}

export default function LandingPage({ gameId }: params) {
  const [quizzes, setQuizzes] = useState<QuizList>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [timeLimit, setTimeLimit] = useState<number>(30)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()
  const { socket, ready } = useGameSocket()



  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session?.accessToken}`,
          }
        })

        if (!res.ok) {
          throw new Error("Failed to fetch quizzes")
        }

        const data = await res.json()
        setQuizzes(data)
      } catch (err: any) {
        console.error(err)
        setError("Could not fetch quizzes. Make sure you're logged in.")
      }
    }

    fetchQuizzes()
  }, [session?.accessToken])


  const handleSelectQuiz = (quizId: number) => {
    const quiz = quizzes.find(q => q.id === quizId) || null
    setSelectedQuiz(quiz)
    if (quiz) {
      socket?.send(JSON.stringify({ type: "quiz_selected", "quiz": quiz.id }))
    }
  }

  const handleStartQuiz = () => {
    if (!selectedQuiz) return
    console.log("Starting quiz:", selectedQuiz, "with time limit:", timeLimit)
    socket?.send(JSON.stringify({ type: "game_started", "quiz": selectedQuiz.id }))
  }

  if (!ready) {
    return (
      <p>Loading...</p>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Quiz content (2/3 of width) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Select a Quiz</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleSelectQuiz(quiz.id)}
                className={`cursor-pointer p-4 border rounded-lg text-sm transition duration-200 ${selectedQuiz?.id === quiz.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:shadow hover:border-blue-300"
                  }`}
              >
                <h3 className="font-semibold text-gray-800 truncate">{quiz.name}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {quiz.description || "No description available."}
                </p>
              </div>
            ))}
          </div>

          {selectedQuiz && (
            <div className="mt-6 p-4 border rounded-lg bg-white shadow space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Ready to start: {selectedQuiz.name}
              </h2>

              <label className="flex items-center gap-2 text-sm">
                Time Limit:
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[15, 30, 60, 120].map((t) => (
                    <option key={t} value={t}>
                      {t} seconds
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={handleStartQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <FriendsBar gameId={gameId} />
        </div>
      </div>
    </div>
  )
}

