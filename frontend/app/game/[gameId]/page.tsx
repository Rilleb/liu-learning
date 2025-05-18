import GameHandeler from "@/app/components/game/game";
import GameSocketConnector from "@/app/components/sockets/gameSocketConnector";


export default async function Game({ params, }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params
	// console.log("gameId", gameId)
	return (
		<GameSocketConnector gameId={gameId}>
			<GameHandeler gameId={gameId} />
		</GameSocketConnector>
	)
}
