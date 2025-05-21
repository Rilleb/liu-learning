"use client"
import Image from "next/image";
import { FriendsList, UserList } from "@/app/data_types/data_types";
import { useSelector } from 'react-redux';
import { setFriends } from "../store/friendSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/app/data_types/data_types";
import * as Popover from '@radix-ui/react-popover';
import { useSocket } from "@/app/components/sockets/socketContext";
import { useRouter } from "next/navigation";
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

interface params {
    gameId: string
}

export default function FriendsBar({ gameId }: params) {
    const dispatch = useAppDispatch();
    const { data: session, status } = useSession();
    const { socket, ready } = useSocket()
    const router = useRouter()
    const [inviteUsername, setInviteUsername] = useState("");

    const hasFriends = useAppSelector((state) => {
        if (state.friends.online && state.friends.offline) {
            return state.friends.online.length > 0 || state.friends.offline.length > 0
        } else {
            return false
        }
    }
    );

    useEffect(() => {
        if (!hasFriends) {
            //moved the fetching to here to leverage redux to avoid fetching multiple times when switching routes
            const fetchFriends = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/friends/`, {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Token ${session?.accessToken}`,
                        }
                    });
                    if (response.ok) {
                        const friendsData: FriendsList = await response.json();
                        dispatch(setFriends(friendsData));
                    } else {
                        console.error("Error fetching friends");
                    }
                } catch (e) {
                    console.error(`Error fetching friends, ${e}`)
                }
            };

            fetchFriends();
        }
    }, [hasFriends, session, status, dispatch]);  // Re-run only when necessary

    const online: UserList = useSelector((state: RootState) => state.friends.online);
    const offline: UserList = useSelector((state: RootState) => state.friends.offline);



    if (!ready) {
        return <p>Connecting</p>
    }

    const inviteUser = (friend: User) => {
        if (!socket) { return null }
        if (!gameId) {
            router.push("/game")
        }
        if (socket?.readyState == WebSocket.OPEN) {
            socket.send(JSON.stringify({ "type": "invite_user", "user_id": friend.id, "game_id": gameId }))
        }

    }

    const sendFriendInvite = () => {
        if (socket && socket.readyState === WebSocket.OPEN && inviteUsername) {
            socket.send(JSON.stringify({
                type: "friend_invite",
                to: inviteUsername,
            }));
            setInviteUsername("");
        }
    };


    return (
        <div>

            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button className="p-2 bg-gray-600 text-white shadow hover:bg-gray-700 mb-4 float-right">
                        +
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/30 fixed inset-0" />
                    <Dialog.Content className="bg-white p-6 rounded-lg shadow-xl w-[300px] fixed top-[20%] left-[calc(50%-150px)]">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-semibold">Add Friend</Dialog.Title>
                            <Dialog.Close asChild>
                                <button>
                                    X
                                </button>
                            </Dialog.Close>
                        </div>
                        <input
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                            placeholder="Enter username"
                            className="border p-2 w-full rounded mb-4"
                        />
                        <button
                            onClick={sendFriendInvite}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                        >
                            Send Invite
                        </button>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <h3>Friends Online</h3>
            <ul>
                {online && online.map((friend, index) => {
                    return (
                        <Popover.Root key={`offline-friend-${index}`}>
                            <Popover.Trigger asChild>
                                <div className="flex items-center p-2 hover:border hover:border-gray-600 cursor-pointer hover:shadow-gray-400 hover:shadow-xl rounded-xl">
                                    <Image src="/globe.svg" alt="Profile-Pic" width={15} height={15} className="m-1" />
                                    {friend.username}
                                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block m-1" />
                                </div>
                            </Popover.Trigger>

                            <Popover.Portal>
                                <Popover.Content
                                    className="bg-white border p-4 rounded shadow z-50 w-48"
                                    side="right"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <p className="font-bold">{friend.username}</p>
                                    <p className="text-sm text-gray-500">Status: Online</p>
                                    <button
                                        onClick={() => inviteUser(friend)}
                                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
                                    >
                                        Invite to Game
                                    </button>
                                    <Popover.Arrow className="fill-white" />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    )
                })}
            </ul>
            <h3>Friends Offline</h3>
            <ul>

                {offline && offline.map((friend, index) => (
                    <Popover.Root key={`offline-friend-${index}`}>
                        <Popover.Trigger asChild>
                            <div className="flex items-center p-2 hover:border hover:border-gray-600 cursor-pointer hover:shadow-gray-400 hover:shadow-xl rounded-xl">
                                <Image src="/globe.svg" alt="Profile-Pic" width={15} height={15} className="m-1" />
                                {friend.username}
                                <span className="h-2 w-2 rounded-full bg-red-500 inline-block m-1" />
                            </div>
                        </Popover.Trigger>

                        <Popover.Portal>
                            <Popover.Content
                                className="bg-white border p-4 rounded shadow z-50 w-48"
                                side="right"
                                align="start"
                                sideOffset={8}
                            >
                                <p className="font-bold">{friend.username}</p>
                                <p className="text-sm text-gray-500">Status: Offline</p>
                                <button
                                    onClick={() => inviteUser(friend)}
                                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
                                >
                                    Invite to Game
                                </button>
                                <Popover.Arrow className="fill-white" />
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                ))}

            </ul>

        </div >
    )
};

