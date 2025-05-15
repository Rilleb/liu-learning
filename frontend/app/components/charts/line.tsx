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
import { DateBasedStat } from "@/app/data_types/data_types";

interface Props {
    data: DateBasedStat[]
    metric: string
    is_multiple: boolean
}


const LineChartDate: React.FC<Props> = ({ data, metric, is_multiple }) => {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey={"date"} />
                    <YAxis />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Line type="monotone" dataKey={`user_${metric}`} stroke="#8884d8" dot={false} connectNulls={true} />
                    {is_multiple && (<Line type="monotone" dataKey={`friend_${metric}`} stroke="#333333" dot={false} connectNulls={true} />)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChartDate;
