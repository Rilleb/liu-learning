"use client"

import React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { AttemptsData } from "@/app/profile/page";

interface Props {
    data: AttemptsData[]
    metric: string
}


const LineChartDate: React.FC<Props> = ({ data, metric }) => {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey={"date"} />
                    <YAxis dataKey={metric} />
                    <Tooltip />
                    <Line type="monotone" dataKey={metric} stroke="#8884d8" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChartDate;
