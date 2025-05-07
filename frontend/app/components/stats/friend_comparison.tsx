"use client"

import { AttemptsData } from "@/app/profile/page";
import SearchBar from "../searchBar";
import { useDebounceCallback } from "usehooks-ts";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function FriendStats() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<string[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const { data: session, status } = useSession();

    const [query, setQuery] = useState("")

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>You are not logged in</p>;

    const token = session.accessToken;

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
                const users: string[] = await res.json();
                setResults(users);
                setShowDropdown(true);
            }
        } catch (err) {
            console.log("Error during search:", err);
        } finally {
            setLoading(false);
        }
    }, 300);

    return (
        <div className="flex flex-col items-center w-full">
            <SearchBar onSearch={handleSearch} />

            {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}

            {showDropdown && results.length > 0 && (
                <ul className="w-full max-w-md mt-2 bg-white border rounded shadow">
                    {results.map((user, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            {user}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

