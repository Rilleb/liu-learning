"use client"
import Image from "next/image";
import { FriendsList, UserList } from "../data_types/data_types";

interface Props {
    friends: FriendsList
}

export default function FriendsBar({ friends }: Props) {
    const { online, offline } = friends
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

