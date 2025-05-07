"use client"
import { get_courses, get_latest_quizes, get_user } from '../lib/get_data'

type Props = {
    userId: number
}

const AccountComponent = ({ userId }: Props) => {
    return (
        <div>
            <h1>Account Information</h1>
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <li>
                    <p>Name: {} </p>
                </li>
                <li>
                    <p>Email: {} </p>
                </li>
                <li>
                    <p>Created: {} </p>
                </li>
                <li>
                    <p>Course Count: {} </p>
                </li>
                <li>
                    <p>Friends Count: {} </p>
                </li>
            </ul>
        </div>
    )
}

export default function Home() {
    const userId = 1
    const user_data = get_user(userId)

    const handleChangePassword = () => {
        console.log("Change password")
    }

    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-1 lg:grid-cols-1 lg:grid-rows-5 overflow-auto">
            {/*Account Information*/}
            <div className="tile-marker col-span-2 border-2 row-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <AccountComponent userId={userId} />
            </div>
            {/*Change Password*/}
            <button
                type="button"
                className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all"
                onClick={handleChangePassword}
            >
                Change Password
            </button>
        </div>
    )
}
