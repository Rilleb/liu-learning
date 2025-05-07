import { FriendStats } from "../components/stats/friend_comparison"
import Stats from "../components/stats/stats"

export interface AttemptsData {
    date: Date
    total_attempts: number
    ratio: number
    successfull_attempts: number
}

export default function Profile() {
    return (
        <div className="h-full w-full grid grid-cols-5">
            <div className="col-span-2 rounded-sm shadow-lg">
                <Stats />
            </div>
            <div className="col-span-2">
                <FriendStats />
            </div>
        </div>
    )
}
