'use client';

import Link from 'next/link'
import { Quiz } from '../data_types/data_types';

export default function QuizDescription({
  quiz,
  quiz_length,
  course_id
}: {
  quiz: Quiz;
  quiz_length: number
  course_id: number;
}) {
  return (
    <div className="font-medium">
      <h1>Quiz: {quiz.name}</h1>
      <h2>Description: {quiz.description} </h2>
      <h2>Number of cards: {quiz_length} </h2>
      <Link href={`/courses/${course_id}/${quiz.id}/started`}>
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
