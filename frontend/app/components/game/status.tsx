"use client"

import { useGameSocket } from "@/app/components/sockets/gameSocketContext"
import { useEffect, useState } from "react"

type UserProgress = {
  username: string
  question_index: number
  correct_count: number
}

export default function StatusBar() {
  const { socket, ready } = useGameSocket()
  const [progressData, setProgressData] = useState<UserProgress[]>([])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "user_progress" && Array.isArray(data.users)) {
          setProgressData(data.users)
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
    return <p>Loading...</p>
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">User Progress</h2>
      <ul className="space-y-2">
        {progressData.map((user, index) => (
          <li key={index} className="flex justify-between border-b pb-1">
            <span className="font-medium">{user.username}</span>
            <span className="text-sm text-gray-600">
              Q{user.question_index} | ✅ {user.correct_count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

