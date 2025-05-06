import { get_courses, get_user } from '../lib/get_data'
import ProgressBar from '../components/progress_bar'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

type Props = {
    userId: number
}

const CourseComponent = ({ userId }: Props) => {
    const courses = get_courses(userId)

    return (
        <div className="font-medium">
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-2 ">
                {courses &&
                    courses.map((course) => (
                        <li
                            key={course.courseId}
                            className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                        >
                            <Link href={`/course/${course.courseId}`}>
                                <div className="space-y-2">
                                    <h3 className="hover:underline">
                                        {course.title}
                                    </h3>
                                    <ProgressBar
                                        total={course.quizes.length}
                                        completed={
                                            course.completedQuizes.length
                                        }
                                    />
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
                <h1>Courses</h1>
                <CourseComponent userId={userId} />
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <h2 className='text-[var(--foreground)]'>Friends</h2>
                {user_data?.friends.map((id) => {
                    const tmp = get_user(id)
                    return <p key={id}>{tmp?.name}</p>
                })}
            </div>
        </div>
    )
}
