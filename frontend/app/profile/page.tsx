import { get_courses, get_latest_quizes, get_user } from '../lib/get_data'
import FriendsBar from '../components/friend_bar'

export default function Home() {
    const userId = 1
    const user_data = get_user(userId)

    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-3 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Stat 1*/}
            <div className="tile-marker col-span-1 border-2 row-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <h1>Stat 1</h1>
            </div>
            {/*Stat 1*/}
            <div className="tile-marker col-span-1 border-2 row-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <h1>Stat 2</h1>
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar activeFriends={["James", "Thea", "Gustav", "Rickard"]} offlineFriends={["Christina", "Oscar"]} />
            </div>
        </div>
    )
}
