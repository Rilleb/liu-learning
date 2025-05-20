'use client'; 

import Link from 'next/link'

export default function QuizDescription({
  quiz_id,
  name,
  description,
  questions, 
  course_id
}: {
  quiz_id: number;
  name: string;
  description: string;
  questions: number;
  course_id: number;
}) {
  return (
    <div className="font-medium">
      <h1>{name}</h1>
      <h2>{description} </h2>
      <h2>Number of cards: {questions} </h2>
      <Link href={`/courses/${course_id}/${quiz_id}/started`}>
        <button
            type="button"
            className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
        >
            Start
        </button>
      </Link>
    </div>
  );
}