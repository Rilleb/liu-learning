
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSocket } from '../components/sockets/socketContext';

export default function HomePage() {
    const [roomId, setRoomId] = useState('');
    const router = useRouter()
    const { socket, ready } = useSocket()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/game/${roomId}`)
    };

    const handleCreateRoom = () => {
        if (!socket) {
            return null
        }
        socket.send(JSON.stringify({ type: "create_game" }))
    }

    if (!ready) {
        return <p>Loading...</p>
    }

    return (
        <div className="flex items-center justify-center bg-[var(--background)] p-4">
            <div className="bg-[var(--color1)] rounded-xl w-full max-w-md p-6 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h1 className="text-xl font-semibold text-center text-gray-800">Join a Room</h1>
                    <div>
                        <label
                            htmlFor="room-id"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Enter Room ID
                        </label>
                        <input
                            id="room-id"
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full p-2 border bg-[var(--background)] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Room ID"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[var(--color2)] text-white font-semibold rounded hover:bg-[var(--color3)] transition"
                    >
                        Join Room
                    </button>
                </form>

                <div className="text-center space-y-2">
                    <h2 className="text-[var(--foreground2)]">Don’t have a room?</h2>
                    <button
                        type="button"
                        className="w-full py-2 px-4 bg-[var(--color_green)] text-white font-semibold rounded hover:bg-[var(--color_green_hover)] transition"
                        onClick={() => handleCreateRoom()}
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
}

