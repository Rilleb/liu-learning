
"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GameSocketContext } from "@/app/components/sockets/gameSocketContext";

export default function GameSocketConnector({ children, gameId }: { children: React.ReactNode, gameId: string }) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [ready, setReady] = useState(false)


  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const ws = new WebSocket(`ws://localhost:8000/ws/game/room/${gameId}/`);
      setSocket(ws)


      ws.onopen = () => {
        console.log("Connected to WebSocket");
        setReady(true)
        ws.send(JSON.stringify({
          type: "auth",
          token: session.accessToken
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message:", data);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      return () => ws.close();
    }
  }, [session, status]);

  return (
    <GameSocketContext.Provider value={{ socket, ready }}>
      {children}
    </GameSocketContext.Provider>
  )
}
