"use client"

import { useEffect, useState } from "react"
import { QuizAttempt } from "./../data_types/data_types"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

type Props = {
  attempt_id: number;
  ended_at: number; 
  passed: boolean;
}

export default function QuizEnded({ attempt_id, ended_at, passed }: Props) {
  const [error, setError] = useState(false);
  const [quiz_attempt, setResult] = useState<QuizAttempt>();
  const router = useRouter();

  const params = useParams();

  const course_id = params.course_id;
  const quiz_id = params.quiz_id;

  useEffect(() => {
    const sendUpdate = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz_attempt/change`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            attempt_id,
            ended_at: new Date(ended_at).toISOString(), // Convert timestamp to ISO string
            passed,
          }),
        });

        if (!res.ok) {
          setError(true);
          return;
        } 

        const data: QuizAttempt = await res.json();
        setResult(data); 

      } catch (err) {
        setError(true);
      }
    };

    sendUpdate();
  }, []);


  if (error) {
    return <div>Could not update quiz attempt</div>;
  }

  const quiz = quiz_attempt?.quiz.name;
  const pass = quiz_attempt?.passed;

  const text = pass ? "You passed the quiz!" : "You failed the quiz";
  return ( <div className="flex justify-center px-4">
    <div className="max-w-4xl border-2 border-[var(--color2)] rounded-md p-4 text-center">
      <h1 className="!text-[var(--color3)] !font-normal !text-2xl">{quiz}</h1>
      <h1 className="mt-8">{text}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <button
            onClick={() => router.push(`/courses/${course_id}/${quiz_id}`)}
            className="bg-[var(--color2)] text-[var(--background)] px-4 py-2 rounded hover:bg-[var(--color3)]"
        >
            Retry Quiz
        </button>
        <button
            onClick={() => router.push("/")}
            className="bg-[var(--color2)] text-[var(--background)] px-4 py-2 rounded hover:bg-[var(--color3)]"
        >
            Return Home
        </button>
      </div>
    </div>
  </div>);
}
