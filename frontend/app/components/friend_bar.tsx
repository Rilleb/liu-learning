import Image from "next/image";

interface FriendsBarProps {
    activeFriends: string[];
    offlineFriends: string[];
}

export default function FriendsBar({ activeFriends, offlineFriends }: FriendsBarProps) {
    return (
        <div>
            <h3>Active</h3>
            <ul>
                {activeFriends && activeFriends.map((friend) => {
                    return (
                        <div className="flex items-center">
                            <Image src={"globe.svg"} alt="Profile-Pic" width={15} height={15} className="m-1" />
                            {friend}
                            <span className="h-2 w-2 rounded-full bg-green-500 inline-block m-1" />
                        </div>
                    )
                })}
            </ul>
            <h3>Offline</h3>
            <ul>
                {offlineFriends && offlineFriends.map((friend) => {
                    return (
                        <div className="flex items-center">
                            <Image src={"globe.svg"} alt="Profile-Pic" width={15} height={15} className="m-1" />
                            {friend}
                            <span className="h-2 w-2 rounded-full bg-red-500 inline-block m-1" />
                        </div>
                    )
                })}
            </ul>

        </div>
    )
};

