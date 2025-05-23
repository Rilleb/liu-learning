import { getServerSession } from "next-auth"
import { options } from "./api/auth/[...nextauth]/options"
import ProgressBar from './components/progress_bar'
import Link from 'next/link'
import { CourseList, FriendsList, QuizList, UserList } from "./data_types/data_types"
import FriendsBar from './components/friend_bar'


const QuizComponent = async ({ quizzes }: { quizzes: QuizList }) => {

    return (
        <div>
            {/*Think it would be cool to make so if you hover on a quiz, the card flip and gives a description*/}
            <h1>Upcoming Quizzes</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes &&
                    quizzes.map((quiz) => {
                        return (
                            <li
                                key={quiz.id}
                                className="border-2 border-[var(--color2)] rounded-md p-4"
                            >
                                <Link href={`/courses/${quiz.course.id}/${quiz.id}`}>
                                    <p className="hover:underline">Quiz: {quiz.name} </p>
                                </Link>
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}

export async function CourseComponent({ courses }: { courses: CourseList }) {
    return (
        <div>
            <h1>Followed Courses</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {courses && courses.map((course) => (
                    <li
                        key={course.id}
                        className="border-2 border-[var(--color2)] rounded-md p-4"
                    >
                        <Link href={`/courses/${course.id}`}>
                            <div className="space-y-2">
                                <h3 className="hover:underline">
                                    {course.name}
                                </h3>
                                {/*
                                <ProgressBar
                                    total={course}
                                    completed={course.completedQuizes.length}
                                />
                                */}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default async function Home() {
    const session = await getServerSession(options)

    if (!session) {
        return (
            <div>
                <p>Could not fetch courses, no logged in user</p>
            </div>
        )
    }

    const courseRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
        cache: 'no-store', // optional: prevents Next.js from caching the fetch
    })

    if (!courseRes.ok) {
        return <div>Error fetching courses</div>
    }

    const courses: CourseList = await courseRes.json()

    const quizRes = await fetch(`${process.env.BACKEND_URL}/api/quiz/`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            //@ts-ignore
            'Authorization': `Token ${session.accessToken}`,
        }
    })

    if (!quizRes.ok) {
        return (
            <div>
                <p>Error fetching quizes</p>
                <p>Make sure you are logged in</p>
            </div>
        )
    }
    const quizzes: QuizList = await quizRes.json()

    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-visible">
            {/*Quizzes*/}
            <div className="tile-marker col-span-2 border-2 row-span-2 rounded-sm border-[var(--color3)] p-4 overflow-visible">
                <QuizComponent quizzes={quizzes} />
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar />
            </div>
            {/*Courses*/}
            <div className=" tile-marker col-span-2 border-2 overflow-visible md-col-span-2 row-span-2 rounded-sm border-[var(--color3)] p-4">
                <CourseComponent courses={courses} />
            </div>
        </div>
    )
}
