import FriendsBar from '../../../components/friend_bar'
import { getServerSession } from "next-auth"
import { options } from "../../../api/auth/[...nextauth]/options"
import { Quiz, UserList } from "../../../data_types/data_types"
import QuizDescription from '../../../components/QuizDescription'


export default async function Home({ params }: { params: { quiz_id: number, course_id: number } }) {
    const quiz_id = await params.quiz_id
    const session = await getServerSession(options)

    if (!session) {
        return (
            <div>
                <p>Error fetching Quiz</p>
            </div>
        )
    }


    const res = await fetch(`${process.env.BACKEND_URL}/api/quiz/?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
    });

    if (!res.ok) {
        return (
            <div>
                <p> Error fetching Quiz data </p>
                <p> Make usre you are logged in </p>
            </div>
        )
    }
    const quiz: Quiz = await res.json()


    const resQuizLength = await fetch(`${process.env.BACKEND_URL}/api/quiz/questionCount?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });

    const quiz_length: number = await resQuizLength.json()

    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Quizzes*/}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <QuizDescription quiz={quiz} quiz_length={quiz_length} course_id={params.course_id} />

            </div>
            {/*Friends*/}
            <div className="tile-marker co-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar />
            </div>
        </div>
    )
}
