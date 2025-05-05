import { get_courses, get_latest_quizes, get_user } from './lib/get_data'
import ProgressBar from './components/progress_bar'
import Link from 'next/link'
import FriendsBar from './components/friend_bar'

type Props = {
    userId: number
}

const CourseComponent = ({ userId }: Props) => {
    const courses = get_courses(userId)

    return (
        <div className="font-medium">
            <h1>Courses</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {courses &&
                    courses.map((course) => (
                        <li
                            key={course.courseId}
                            className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                        >
                            <Link href={`/courses/${course.courseId}`}>
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
const QuizComponent = ({ userId }: Props) => {
    const quizes = get_latest_quizes(12)
    return (
        <div>
            {/*Think it would be cool to make so if you hover on a quiz, the card flip and gives a description*/}
            <h1>Upcoming Quizes</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizes &&
                    quizes.map((quiz ) => {
                        return (
                            <li
                                key={quiz.quizId}
                                className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow"
                            >
                                <Link href={'/quiz_that_needs_to_change'}>
                                    <p>Quiz: {quiz.name} </p>
                                </Link>
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}

export default function Home() {
    const userId = 1
    const user_data = get_user(userId)

    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Quizes*/}
            <div className="tile-marker col-span-2 border-2 row-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <QuizComponent userId={userId} />
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar activeFriends={["James", "Thea", "Gustav", "Rickard"]} offlineFriends={["Christina", "Oscar"]} />
            </div>
            {/*Courses*/}
            <div className=" tile-marker col-span-2 border-2 overflow-auto md-col-span-2 row-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <CourseComponent userId={userId} />
            </div>
        </div>
    )
}
