"use client"

import SearchBar from "../searchBar";
import LineChartDate from "../charts/line";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserList, User, CombinedQuizStatistics, DateBasedStat, CourseBasedStat } from "@/app/data_types/data_types";
import RadarCourseChart from "../charts/radar";

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

    const token = session?.accessToken ?? "";
    const username = session?.user?.name

    const onClick = (async (user: User) => {
        setQuery(user.username)
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
            console.log(err)
            console.log("Could not get data")
        }
        setLoading(false)

    })


    const handleSearch = useDebounceCallback(async (q: string) => {
        console.log("Handle search: ", q)
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
            console.log("Error during search:", err);
        } finally {
            setLoading(false);
        }
    }, 300);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch} value={query} />

            {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}

            {showDropdown && results.length > 0 && (
                <ul className="w-full max-w-md mt-2 bg-white border rounded shadow">
                    {results.map((user, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => onClick(user)}>
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}

            <div className="w-full h-full p-2">
                <div className="w-full h-[200px]">
                    <p>Number of Quiz Attempts</p>
                    <LineChartDate data={dateBasedData} metric="total_attempts" is_multiple={userSelected} />
                </div>
                <div className="w-full h-[200px]">
                    <p>Ratio</p>
                    <LineChartDate data={dateBasedData} metric="ratio" is_multiple={userSelected} />
                </div>
                <div className="w-full h-[200px]">
                    <p>Total time spent</p>
                    <LineChartDate data={dateBasedData} metric="time_spent" is_multiple={userSelected} />
                </div>
                <div className="w-full h-[200px]">
                    <p>Attempts by course</p>
                    <RadarCourseChart data={courseBasedData} user="PLACEHOLDER" is_multiple={userSelected} />
                </div>

            </div>

        </div>
    )
}

