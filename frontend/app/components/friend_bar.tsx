"use client"
import Image from "next/image";
import { FriendsList, UserList } from "@/app/data_types/data_types";
import { useSelector } from 'react-redux';
import { setFriends } from "../store/friendSlice";
import { RootState, useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { useSession } from "next-auth/react";


export default function FriendsBar() {
    const dispatch = useAppDispatch();
    const { data: session, status } = useSession();

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


    return (
        <div>
            <h3>Active</h3>
            <ul>
                {online && online.map((friend, index) => {
                    return (
                        <div key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {friend.username}
                            <span className="h-2 w-2 rounded-full bg-[var(--color_green)] inline-block m-1" />
                        </div>
                    )
                })}
            </ul>
            <span className="flex items-center">
                <span className="h-0.25 flex-1 bg-[var(--color3)] rounded-full"></span>
            </span>
            <h3>Offline</h3>
            <ul>
                {offline && offline.map((friend, index) => {
                    return (
                        <div key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {friend.username}
                            <span className="h-2 w-2 rounded-full bg-[var(--color_red)] inline-block m-1" />
                        </div>
                    )
                })}
            </ul>

        </div>
    )
};

