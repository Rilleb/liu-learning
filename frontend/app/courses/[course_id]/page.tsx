import { getQuizzesForCourse, get_course_name } from '../../lib/get_data'
import Link from 'next/link'
import FriendsBar from '../../components/friend_bar'
import { getServerSession } from "next-auth"
import { options } from "../../api/auth/[...nextauth]/options"
import { UserList, QuizList } from "../../data_types/data_types"

// async function FriendsComponent() {
//     const session = await getServerSession(options);
//     if (!session) {
//         return <div>Not authenticated</div>;
//     }
//
//     const res = await fetch(`${process.env.BACKEND_URL}/api/friends`, {
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': `Token ${session.accessToken}`,
//         }
//     });
//
//     if (!res.ok) {
//         return <div>Error loading friends</div>;
//     }
//
//     const friends: UserList = await res.json();
//     return <FriendsBar friends={friends} />;
// }

const QuizComponent = async ({ id }: { id: number }) => {
    const session = await getServerSession(options)
    if (!session) {
        return (
            <div>
                <p>Error fetching Quiz</p>
            </div>
        )
    }
    const res = await fetch(`${process.env.BACKEND_URL}/api/quiz`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            //@ts-ignore
            'Authorization': `Token ${session.accessToken}`,
        }
    })

    if (!res.ok) {
        return (
            <div>
                <p>Error fetching quizes</p>
                <p>Make sure you are logged in</p>
            </div>
        )
    }
    const quizes: QuizList = await res.json()
    console.log("Quizes: ", quizes)
    return (
        <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizes &&
                    quizes.map((quiz) => {
                        return (
                            <li
                                key={quiz.id}
                                className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                            >
                                <Link href={`/courses/${id}/${quiz.id}`}>
                                    <p>Quiz: {quiz.name} </p>
                                </Link>
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}


export default function Home({ params }: { params: { course_id: number } }) {
    const courseId = Number(params.course_id)

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
                <FriendsBar />
            </div>
        </div>
    )
}
