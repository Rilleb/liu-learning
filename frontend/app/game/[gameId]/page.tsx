import GameHandeler from "@/app/components/game/game";
import GameSocketConnector from "@/app/components/sockets/gameSocketConnector";
import { getServerSession } from "next-auth";


export default async function Game({ params, }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params
	const session = await getServerSession()
	const ws = new WebSocket(`ws://localhost:8000/game/${gameId}`)
	ws.onopen = () => {
		console.log("Connected to WebSocket");
		ws.send(JSON.stringify({
			type: "auth",
			token: session?.accessToken
		}));
	};
	return (
		<GameSocketConnector gameId={gameId}>
			<p>Something</p>
			<p>Some more</p>
			<GameHandeler />
		</GameSocketConnector>
	)
}
