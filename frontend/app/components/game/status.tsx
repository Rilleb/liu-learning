"use client"

import { useGameSocket } from "@/app/components/sockets/gameSocketContext"

export default function StatusBar() {
  const { socket, ready } = useGameSocket()


  if (!ready) {
    return <p>Loading...</p>
  }

  return (
    <div>
    </div>
  )
}
