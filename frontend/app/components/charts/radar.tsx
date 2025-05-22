"use client"

import React from "react"
import {
    RadarChart,
    ResponsiveContainer,
    Radar,
    PolarGrid,
    Legend,
    PolarAngleAxis,
} from "recharts";
import { CourseBasedStat } from "@/app/data_types/data_types";

interface Props {
    data: CourseBasedStat[]
    user: string
    friend: string
    is_multiple: boolean
}


const RadarCourseChart: React.FC<Props> = ({ data, user, friend, is_multiple }) => {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="course" />
                    <Radar name={user} dataKey="user_attempts" stroke="#89CFF0" fill="#89CFF0" fillOpacity={0.4} />
                    {is_multiple && (<Radar name={friend} dataKey="friend_attempts" stroke="#008000" fill="#008000" fillOpacity={0.4} />)}
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RadarCourseChart;

