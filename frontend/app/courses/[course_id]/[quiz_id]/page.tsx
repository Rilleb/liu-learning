"use client"

import { get_quiz_name } from '../../../lib/get_data'
import Link from 'next/link'
import FriendsBar from '../../../components/friend_bar'
import { useParams } from 'next/navigation'

const QuizDescription = () => {
    const params = useParams()
    const quiz_id = Number(params.quiz_id)
    const name = get_quiz_name(quiz_id)

    return (
        <div className="font-medium">
            <h1>Quiz: {name} </h1>
        </div>
    )
}

export default function Home() {
   
    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Quizzes*/}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <QuizDescription/>
                
            </div>
            {/*Friends*/}
            <div className="tile-marker co-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar activeFriends={["James", "Thea", "Gustav", "Rickard"]} offlineFriends={["Christina", "Oscar"]} />
            </div>
        </div>
    )
}
