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
    is_multiple: boolean
}


const RadarCourseChart: React.FC<Props> = ({ data, user, is_multiple }) => {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="course" />
                    <Radar name={user} dataKey="user_attempts" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    {is_multiple && (<Radar name={user} dataKey="friend_attempts" stroke="#555555" fill="#55555" fillOpacity={0.6} />)}
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RadarCourseChart;

