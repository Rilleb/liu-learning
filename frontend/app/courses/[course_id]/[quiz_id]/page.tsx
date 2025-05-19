import FriendsBar from '../../../components/friend_bar'
import { getServerSession } from "next-auth"
import { options } from "../../../api/auth/[...nextauth]/options"
import { UserList } from "../../../data_types/data_types"
import QuizDescription from '../../../components/QuizDescription'


// async function FriendsComponent() {
//     const session = await getServerSession(options);
//     if (!session) {
//         return <div>Not authenticated</div>;
//     }
//
//     const res = await fetch(`${process.env.BACKEND_URL}/api/friends`, {
//         method: 'GET',
//         headers: {
//             'Content-type': 'application/json',
//             'Authorization': `Token ${session.accessToken}`,
//         }
//     });
//
//     if (!res.ok) {
//         return <div>Error loading friends</div>;
//     }
//
//     const friends: UserList = await res.json();
//     return <FriendsBar friends={friends} />;
// }

interface QuizData {
    name: string
    description: string
    questions: number
}

async function getQuizData(quiz_id: number): Promise<QuizData> {

    const resDesc = await fetch(`${process.env.BACKEND_URL}/api/quiz/description?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });
    const desc: string = await resDesc.json()

    const resName = await fetch(`${process.env.BACKEND_URL}/api/quiz/description?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });
    const name: string = await resName.json()

    const resQuestion = await fetch(`${process.env.BACKENQuizzesD_URL}/api/quiz/questionCount?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });
    const questions: number = await resQuestion.json()

    const data: QuizData = {
        description: desc,
        name: name,
        questions: questions,
    }
    return data
}

export default async function Home({ params }: { params: { quiz_id: number, course_id: number } }) {
    const quiz_id = params.quiz_id
    const quiz_data = await getQuizData(quiz_id)
    return (
        /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            {/*Quizzes*/}
            <div className="h-screen tile-marker col-span-2 border-2 overflow-auto md-col-span-2 rounded-sm shadow-lg border-[var(--color3)] p-4">
                <QuizDescription quiz_id={params.quiz_id} name={quiz_data.name} description={quiz_data.description} questions={quiz_data.questions} course_id={params.course_id} />

            </div>
            {/*Friends*/}
            <div className="tile-marker co-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-[var(--color3)] p-4 overflow-auto">
                <FriendsBar />
            </div>
        </div>
    )
}
