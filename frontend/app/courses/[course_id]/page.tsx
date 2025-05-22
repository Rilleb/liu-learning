import Link from 'next/link'
import FriendsBar from '../../components/friend_bar'
import { getServerSession } from "next-auth"
import { options } from "../../api/auth/[...nextauth]/options"
import { QuizList, Course } from "../../data_types/data_types"
import FollowButton from '@/app/components/followButton'


const QuizComponent = async ({ courseId }: { courseId: number }) => {
    const session = await getServerSession(options)
    if (!session) {
        return (
            <div>
                <p>Error fetching Quiz</p>
            </div>
        )
    }
    let quizzes: QuizList = [];
    try {

        const res = await fetch(`${process.env.BACKEND_URL}/api/quiz/?course_id=${courseId}`, {
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
        quizzes = await res.json()
    } catch (e) {
        console.error("Error: ", e)
        return (
            <div>
                <p>Error fetching quizzes </p>
            </div>
        )
    }
    return (
        <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes &&
                    quizzes.map((quiz) => {
                        return (
                            <li
                                key={quiz.id}
                                className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                            >
                                <Link href={`/courses/${courseId}/${quiz.id}`}>
                                    <p>Quiz: {quiz.name} </p>
                                </Link>
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}


async function getCourse(id: number) {
    const res = await fetch(`${process.env.BACKEND_URL}/api/courses/?id=${id}`, {
        method: 'GET',
    });

    if (!res.ok) {
        return "Error loading course name";
    }
    const course: Course = await res.json();
    return course;
}


export default async function Home({ params }: { params: { course_id: number } }) {
    const courseId = await Number(params.course_id)

    const session = await getServerSession(options)

    if (!session) {
        return (
            <div>
                <p>Error fetching auth token</p>
            </div>
        )
    }


    const res = await fetch(`${process.env.BACKEND_URL}/api/courses/?id=${courseId}`, {
        headers: {
            'Authorization': `Token ${session.accessToken}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return "Error loading course";
    }

    const course: Course = await res.json();
    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="tile-marker col-span-2  !overflow-auto md-col-span-2 rounded-sm border-[var(--color3)] p-4">
            <div className='col-span-2'>
                <h1> {course.name} : {course.code} </h1>
                <FollowButton courseId={courseId} accessToken={session.accessToken} />
            </div>
            <p className="text-gray-600 text-sm">{course.description}</p>
            {/*Quizzes*/}
            <div className="h-screen tile-marker col-span-2 border-2 !overflow-auto md-col-span-2 rounded-sm border-[var(--color3)] p-4">
                <h1>Quizzes</h1>
                <QuizComponent courseId={courseId} />
            </div>
            {/*Friends*/}
            <div className="tile-marker co-span-1 col-start-3 border-2 row-span-4 rounded-sm border-[var(--color3)] p-4 !overflow-auto">
                <FriendsBar />
            </div>
        </div>
    )
}
