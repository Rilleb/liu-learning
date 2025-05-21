import QuizCard from '../../../../components/QuizCard'
import { getServerSession } from "next-auth"
import { options } from "../../../../api/auth/[...nextauth]/options"
import { Question, Quiz } from '@/app/data_types/data_types'


async function QuizComponent({ quiz_id, course_id }: { quiz_id: number, course_id: number }) {
    const session = await getServerSession(options)
    if (!session) {
        return (
            <div>
                <p>Error fetching Quiz</p>
            </div>
        )
    }

    const resQuiz = await fetch(`${process.env.BACKEND_URL}/api/quiz/?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        }
    });

    const quiz: Quiz = await resQuiz.json();

    const resQuestion = await fetch(`${process.env.BACKEND_URL}/api/quiz/questions?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });

    if (!resQuestion.ok) {
        return (
            <div>
                <h1>{quiz.name}</h1>
            </div>);
    }
    const question_data: Question[] = await resQuestion.json();

    const attemptRes = await fetch(`${process.env.BACKEND_URL}/api/quiz_attempt/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
        body: JSON.stringify({
            quiz_id: quiz_id,
        })
    });

    if (!attemptRes.ok) {
        return (
            <div>
                <h1>{attemptRes.status}</h1>
                <h1>{attemptRes.statusText}</h1>
            </div>);
    }
    const attempt = await attemptRes.json();

    return (
        <QuizCard questions={question_data} name={quiz.name} quiz_id={quiz_id} course_id={course_id} quiz_attempt_id={attempt.attempt_id} token={session.accessToken} />
    );
}

export default function Home({ params }: { params: { quiz_id: number; course_id: number } }) {
    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            <div className='col-span-2 '>
                <QuizComponent quiz_id={params.quiz_id} course_id={params.course_id} />
            </div>
        </div>
    )
}
