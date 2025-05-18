"use client"

import { useEffect, useState } from "react"
import { QuizAttempt } from "./../data_types/data_types"

type Props = {
  attempt_id: number;
  ended_at: number; 
  passed: boolean;
}

export default function QuizEnded({ attempt_id, ended_at, passed }: Props) {
  const [error, setError] = useState(false);
  const [quiz_attempt, setResult] = useState<QuizAttempt>();

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

  const text = pass ? "You passed the quiz!" : "You FAILED";
  return ( <div>
    <h1>{quiz}</h1>
    <h2>{text}</h2>
  </div> );
}
