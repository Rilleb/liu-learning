import { FriendStats } from "../components/stats/friend_comparison"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"

export interface AttemptsData {
    date: Date
    total_attempts: number
    ratio: number
    successfull_attempts: number
    total_time_spent: number
}

export default async function Profile() {
    const session = await getServerSession(options)
    if (!session || !session.accessToken) {
        return (
            <div>
                <p>Could not get session, make sure you are logged in</p>
            </div>
        )
    }
    const res = await fetch(`${process.env.BACKEND_URL}/api/statistics/quiz/attempts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`
        }
    })

    const data: AttemptsData[] = await res.json() //Data should be returned in order 

    return (
        <div className="h-screen w-full">
            <FriendStats userData={data} />
        </div>
    )
}
