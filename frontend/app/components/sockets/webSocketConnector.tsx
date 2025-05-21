"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setFriendOffline, setFriendOnline, setFriendInvites, addFriendInvite } from "@/app/store/friendSlice";
import { SocketContext } from "@/app/components/sockets/socketContext";
import { Toaster, toast } from 'sonner';
import { useRouter } from "next/navigation";


export default function WebSocketConnector({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()


  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const ws = new WebSocket(`ws://localhost:8000/ws/users/${session.user.id}/`);
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

        if (data.type == "friend_logged_in") {
          dispatch(setFriendOnline(data.user_id));
        } else if (data.type == "friend_logged_off") {
          dispatch(setFriendOffline(data.user_id))
        } else if (data.type == "game_invite_received") {
          toast(`You received an invite from ${data.username}`, {
            description: "Do you want to accept the invite?",
            action: {
              label: "Accept",
              onClick: () => {
                ws.send(JSON.stringify({ type: "game_invite_accepted", invite_came_from: data.from, game_id: data.game_id }))
                router.push(`game/${data.game_id}`)
              },
            },
            cancel: {
              label: "Decline",
              onClick: () => {
                ws.send(JSON.stringify({ type: "game_invite_declined", invite_came_from: data.from }))
              },
            },
          })
        } else if (data.type == "game_invite_answered") {
          if (data.accepted) {
            toast(`${data.username} accepted you game invite`)
          } else {
            toast(`${data.username} declined you game invite`)
          }
        } else if (data.type == "unique_room_id_created") {
          router.push(`/game/${data.game_id}`)
        }
        else if (data.type == "load_friend_invites") {
          dispatch(setFriendInvites(data.invites))
        } else if (data.type === "friend_invite_received") {
          toast(`You received a friend invite from ${data.username}`, {
            description: "Do you want to accept the invite?",
            action: {
              label: "Accept",
              onClick: () => {
                ws.send(JSON.stringify({ type: "accept_friend_invite", invite_came_from: data.from, game_id: data.game_id }))
              },
            },
            cancel: {
              label: "Decline",
              onClick: () => {
                ws.send(JSON.stringify({ type: "decline_friend_invite", invite_came_from: data.from }))
              },
            },
          })
          addFriendInvite(data.friend_invite)
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error", error);
      };

      // Cleanup on component unmount
      return () => ws.close();
    }
  }, [session, status]);

  return (
    <SocketContext.Provider value={{ socket, ready }}>
      <Toaster />
      {children}
    </SocketContext.Provider>
  )
}
