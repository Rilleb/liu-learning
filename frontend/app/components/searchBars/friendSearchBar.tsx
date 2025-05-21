"use client"

import React, { useState, useEffect } from "react"

interface Props {
    onSearch: (query: string) => void
    value: string
}


const FriendSearchBar: React.FC<Props> = ({ onSearch, value }) => {
    const [query, setQuery] = useState(value)

    useEffect(() => {
        setQuery(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setQuery(value)
        onSearch(value)
    }

    return (
        <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for friend"
                className="border px-3 py-2 rounded-full"
            />
        </form>
    )
}
export default FriendSearchBar
