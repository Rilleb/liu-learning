import { FriendStats } from "../components/stats/friend_comparison"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { CombinedQuizStatistics } from "../data_types/data_types"


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

    const data: CombinedQuizStatistics = await res.json() //Data should be returned in order 
    console.log(data)

    return (
        <div className="h-screen w-full">
            <FriendStats userData={data} />
        </div>
    )
}
