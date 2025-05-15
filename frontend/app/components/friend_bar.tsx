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
                            <Image src={"/globe.svg"} alt="Profile-Pic" width={15} height={15} className="m-1" />
                            {friend.username}
                            <span className="h-2 w-2 rounded-full bg-green-500 inline-block m-1" />
                        </div>
                    )
                })}
            </ul>
            <h3>Offline</h3>
            <ul>
                {offline && offline.map((friend, index) => {
                    return (
                        <div key={index} className="flex items-center">
                            <Image src={"/globe.svg"} alt="Profile-Pic" width={15} height={15} className="m-1" />
                            {friend.username}
                            <span className="h-2 w-2 rounded-full bg-red-500 inline-block m-1" />
                        </div>
                    )
                })}
            </ul>

        </div>
    )
};

