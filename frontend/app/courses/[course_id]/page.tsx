"use client"

import { getQuizzesForCourse , get_course_name} from '../../lib/get_data'
import Link from 'next/link'
import FriendsBar from '../../components/friend_bar'
import { useParams } from 'next/navigation'

const QuizComponent = ({ id }: { id: number }) => {
    const quizzes = getQuizzesForCourse(id)
    console.log("ID: ", id);

    return (
        <div className="font-medium">
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-2 ">
                {quizzes &&
                    quizzes.map((quiz) => (
                        <li
                            key={quiz.quizId}
                            className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                        >
                            <Link href={`/courses/${id}/${quiz.quizId}`}>
                                <div className="space-y-2">
                                    <h3 className="hover:underline">
                                        {quiz.name}
                                    </h3>
                                </div>
                            </Link>
                        </li>
                    ))}
            </ul>
        </div>
    )
}


export default function Home() {
    const params = useParams()
    const courseId = Number(params.course_id)
    console.log("All params:", params)

    const courseName = String(get_course_name(courseId))
    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            <div className='col-span-2 '>
                <h1> {courseName} </h1>
            </div>
            {/*Quizzes*/}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <h1>Quizzes</h1>
                <QuizComponent id={courseId} />
            </div>
            {/*Friends*/}
            <div className="tile-marker co-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar activeFriends={["James", "Thea", "Gustav", "Rickard"]} offlineFriends={["Christina", "Oscar"]} />
            </div>
        </div>
    )
}
