async function QuizComponent({ quiz_id }: { quiz_id: number }) {
    const resName = await fetch(`${process.env.BACKEND_URL}/api/quiz/description?quiz_id=${quiz_id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    });

    const name: string = await resName.json();

    return (
        <div>
            <h1>{name}</h1>
        </div>
    );
}
export default function Home({ params }: { params: { quiz_id: number } }) {
    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 overflow-auto">
            <div className='col-span-2 '>
                <QuizComponent quiz_id={params.quiz_id}/>
            </div>
        </div>
    )
}
