"use client"

import { useSearchParams } from 'next/navigation'
import QuizEnded from '../../../../components/attempt_stats'

export default function Home() {
    const searchParams = useSearchParams()
    const attemptId = searchParams.get('attempt_id')
    const endedAt = searchParams.get('ended_at')
    const passed = searchParams.get('passed')

    const attempt_id = attemptId ? parseInt(attemptId, 10) : 0;
    const ended_at = endedAt ?  new Date(endedAt).getTime() : Date.now();
    const passed_converted = passed?.toLowerCase() === 'true';

    return (
         <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Quiz Stats*/}
            <QuizEnded attempt_id={attempt_id} ended_at={ended_at} passed={passed_converted}></QuizEnded>
        </div>
    )
}
