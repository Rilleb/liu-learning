import { options } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession, User } from "next-auth"
import { AttemptsData } from "@/app/profile/page"
import LineChartDate from "../charts/line"

export default async function Stats() {
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
    console.log(data)

    return (
        <div className="w-full h-full p-2">
            <div className="w-full h-1/3 ">
                <p>Number of Quiz Attempts</p>
                <LineChartDate data={data} metric="total_attempts" />
            </div>
            <div className="w-full h-1/3 p-2">
                <p>Ratio</p>
                <LineChartDate data={data} metric="ratio" />
            </div>

        </div>
    )
}
