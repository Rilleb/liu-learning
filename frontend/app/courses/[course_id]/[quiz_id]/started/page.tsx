import QuizCard from '../../../../components/QuizCard'
import { getServerSession } from "next-auth"
import { options } from "../../../../api/auth/[...nextauth]/options"


async function QuizComponent({quiz_id, course_id}: {quiz_id: number, course_id: number}) {
    const session = await getServerSession(options)
    if (!session) {
        return (
            <div>
                <p>Error fetching Quiz</p>
            </div>
        )
    }

    const resName = await fetch(`${process.env.BACKEND_URL}/api/quiz/description?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });

    const name: string = await resName.json();

    const resQuestionIds = await fetch(`${process.env.BACKEND_URL}/api/quiz/questions?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });

    if (!resQuestionIds.ok) {
        return   (      
        <div>
            <h1>{name}</h1>
        </div>); 
    }
    const question_data = await resQuestionIds.json();

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
        return   (      
        <div>
            <h1>{attemptRes.status}</h1>
            <h1>{attemptRes.statusText}</h1>
        </div>); 
    }
    const attempt = await attemptRes.json();

    return (
        <QuizCard questions={question_data} name={name} quiz_id={quiz_id} course_id={course_id} quiz_attempt_id={attempt.attempt_id}/>
    );
}

export default function Home({ params }: { params: { quiz_id: number; course_id: number} }) {
    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            <div className='col-span-2 '>
                <QuizComponent quiz_id={params.quiz_id} course_id={params.course_id}/>
            </div>
        </div>
    )
}
