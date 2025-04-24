import CreateCourseForm from '../components/forms/create_course'
import Link from 'next/link'

export default function Page() {

    return (
        <div className="overflow-auto">
            {/*Quizes*/}
            <div className="overflow-auto">
                <select />
            </div>
            {/*Friends*/}
            <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-gray-300 p-4 overflow-auto">
                <h2>Friends</h2>
                {user_data?.friends.map((id) => {
                    const tmp = get_user(id)
                    return <p key={id}>{tmp?.name}</p>
                })}
            </div>
            {/*Courses*/}
            <div className=" tile-marker col-span-2 border-2 overflow-auto md-col-span-2 row-span-2 rounded-sm shadow-lg border-gray-300 p-4">
                <CourseComponent userId={userId} />
            </div>
        </div>
    )
}
