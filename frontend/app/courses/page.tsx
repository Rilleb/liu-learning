
import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'
import FriendsBar from '../components/friend_bar'
import { Course } from '../data_types/data_types'
import CourseComponent from '../components/CourseComponent'

export default async function Home() {
    const session = await getServerSession(options)

    if (!session) {
        return <p>Could not fetch courses. Please log in.</p>
    }

    const token = session.accessToken

    let allCourses: Course[] = [];
    let followedCourses: Course[] = [];

    const [allCoursesRes, followedCoursesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/?all=true`, {
            headers: { Authorization: `Token ${token}` },
            cache: 'no-store',
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/`, {
            headers: { Authorization: `Token ${token}` },
            cache: 'no-store',
        }),
    ])

    if (!allCoursesRes.ok || !followedCoursesRes.ok) {
        return <p>Error loading courses</p>
    }

    allCourses = await allCoursesRes.json()
    followedCourses = await followedCoursesRes.json()

    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/* Courses */}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <CourseComponent
                    allCourses={allCourses}
                    followedCoursesInitial={followedCourses}
                    accessToken={token}
                />
            </div>
            {/* Friends */}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar />
            </div>
        </div>
    )
}

