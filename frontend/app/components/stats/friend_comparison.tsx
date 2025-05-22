"use client"

import LineChartDate from "../charts/line";
import { useDebounceCallback } from "usehooks-ts";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserList, User, CombinedQuizStatistics, DateBasedStat, CourseBasedStat } from "@/app/data_types/data_types";
import RadarCourseChart from "../charts/radar";
import FriendSearchBar from "../searchBars/friendSearchBar";

interface Props {
    userData: CombinedQuizStatistics
}

export function FriendStats({ userData }: Props) {
    const { date_based, course_based } = userData
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<UserList>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const { data: session, status } = useSession();
    const [query, setQuery] = useState("")
    const [userSelected, setUserSelected] = useState(false)
    const [dateBasedData, setDateBasedData] = useState<DateBasedStat[]>(date_based)
    const [courseBasedData, setCourseBasedData] = useState<CourseBasedStat[]>(course_based)
    const [cmpUser, setCmpUser] = useState<string>("")

    const token = session?.accessToken ?? "";
    const username = session?.user.username ?? "";

    console.log(session)

    const onClick = (async (user: User) => {
        setQuery(user.username)
        setCmpUser(user.username)
        setShowDropdown(false)
        setUserSelected(true)
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/statistics/compare/stats?friend=${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })

            if (!res.ok) {
                console.log("Something went wrong")
            }

            const combinedData: CombinedQuizStatistics = await res.json()
            setUserSelected(true)
            setDateBasedData(combinedData.date_based)
            setCourseBasedData(combinedData.course_based)

        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    })


    const handleSearch = useDebounceCallback(async (q: string) => {
        if (!q) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setQuery(q);
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/statistics/compate/friend?friend=${q}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });

            if (!res.ok) {
                console.log("Request failed");
                setResults([]);
                setShowDropdown(false);
            } else {
                const users: UserList = await res.json();
                setResults(users);
                setShowDropdown(true);
            }
        } catch (err) {
            console.error("Error during search:", err);
        } finally {
            setLoading(false);
        }
    }, 300);

    if (status === "loading") return <p>Loading...</p>;

    return (


        <div className="flex flex-col w-full p-4 box-border h-full">
            {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}

            {/* Container with vertical stack for input and dropdown */}
            <div className="w-full max-w-md mb-4 self-start relative">
                <FriendSearchBar onSearch={handleSearch} value={query} />

                {showDropdown && results.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-auto">
                        {results.map((user, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => onClick(user)}
                            >
                                {user.username}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Moved below input to avoid layout conflict */}
            <label className="flex items-center gap-2 cursor-pointer mb-6">
                <input
                    type="checkbox"
                    checked={userSelected}
                    onChange={() => setUserSelected(!userSelected)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">Compare with friend</span>
            </label>

            {/* Chart Section */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl self-center">
                <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <p className="font-semibold mb-2">Number of quiz attempts</p>
                    <div className="flex-grow">
                        <LineChartDate data={dateBasedData} metric="total_attempts" is_multiple={userSelected} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <p className="font-semibold mb-2">Ratio of passed quizzes compared to total attempts</p>
                    <div className="flex-grow">
                        <LineChartDate data={dateBasedData} metric="ratio" is_multiple={userSelected} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <p className="font-semibold mb-2">Time spent per day</p>
                    <div className="flex-grow">
                        <LineChartDate data={dateBasedData} metric="time_spent" is_multiple={userSelected} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <p className="font-semibold mb-2">Attempts by course</p>
                    <div className="flex-grow">
                        <RadarCourseChart data={courseBasedData} user={username} friend={cmpUser} is_multiple={userSelected} />
                    </div>
                </div>
            </div>
        </div>
    )
}

