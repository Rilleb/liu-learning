"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function WebSocketConnector() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const socket = new WebSocket(`ws://localhost:8000/ws/users/${session.user.id}/`);

      socket.onopen = () => {
        console.log("Connected to WebSocket");
        // Optional: send token for backend auth
        socket.send(JSON.stringify({
          type: "auth",
          token: session.accessToken // if you have it
        }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message:", data);
        if (data.type == "friend_logged_in") {


        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      // Cleanup on component unmount
      return () => socket.close();
    }
  }, [session, status]);

  return null; // or UI component that depends on the socket
}
