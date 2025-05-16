import { get_courses, get_user } from '../lib/get_data'
import ProgressBar from '../components/progress_bar'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import FriendsBar from '../components/friend_bar'
import { CourseList, UserList } from "../data_types/data_types"

async function FriendsComponent() {
    const session = await getServerSession(options);
    if (!session) {
        return <div>Not authenticated</div>;
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/friends`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        }
    });

    if (!res.ok) {
        return <div>Error loading friends</div>;
    }

    const friends: UserList = await res.json();
    return <FriendsBar friends={friends} />;
}

type Props = {
    userId: number
}

export async function CourseComponent() {
    const session = await getServerSession(options)
    if (!session) {
        return (
            <div>
                <p>Could not fetch courses, no logged in user</p>
            </div>
        )
    }
    const res = await fetch(`http://localhost:8000/api/courses`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
        cache: 'no-store', // optional: prevents Next.js from caching the fetch
    })

    if (!res.ok) {
        return <div>Error fetching courses</div>
    }

    const courses: CourseList = await res.json()

    return (
        <div>
            <h1>Courses</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {courses && courses.map((course) => (
                    <li
                        key={course.id}
                        className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
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
    const userId = 1
    const user_data = get_user(userId);

    return (

        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Courses*/}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <CourseComponent/>
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsComponent/>
            </div>
        </div>
    )
}
