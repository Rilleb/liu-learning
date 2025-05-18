"use client"

import { useGameSocket } from "../sockets/gameSocketContext"

export default function GameHandeler() {
  const { socket, ready } = useGameSocket()

  if (!ready) {
    return (<p>Loading...</p>)
  }

  const handleClick = () => {
    if (!socket) {
      return null
    }
    socket.send(JSON.stringify({ Message: "This is a test", type: "event" }))
  }
  return (
    <button
      onClick={() => handleClick()}
      className="hover:cursor-pointer"
    >
      Click Me
    </button>
  )
}
