"use client"

import { Question } from "./../data_types/data_types"
import { useState, useEffect } from "react";
import EnhancedTextbox from './text_box';
import { useRouter } from 'next/navigation';
import { useMemo } from "react";

async function addQuestionAttempt({
  attempt,
  question,
  is_correct,
  is_multiple_choice,
  free_text_answer,
  started_at,
  token,
}: {
  attempt: number;
  question: number;
  is_correct: boolean;
  is_multiple_choice: boolean;
  free_text_answer: string;
  started_at: string;
  token: string;
}) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/question_attempt/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        attempt,
        question,
        is_correct,
        is_multiple: is_multiple_choice,
        free_text_answer,
        started_at,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to record attempt");
    }

    const data = await res.text();
  } catch (err) {
    console.error("Error submitting attempt:", err);
  }
}


export function AnswerDiv({
  question,
  show,
}: {
  question: Question;
  show: boolean;
}) {
  if (show) {
    return (
      <div>
        <h2>The correct answer is: {question.correct_answer} </h2>
      </div>
    );
  }
  return (
    <div>
    </div>
  );
}

export function MultipleChoice({ question, onSelect, selectedAnswer }: { question: Question, onSelect: (answer: string) => void, selectedAnswer:string | null }) {
  const shuffled = useMemo(() => {
    const options = [question.correct_answer, question.alt_1, question.alt_2, question.alt_3]; // must have 3 alternatives
    return [...options].sort(() => Math.random() - 0.5);
  }, [question.id]); 

  return (
    <div>
      <h2>{question.description}</h2>
      {shuffled.map((option, idx) => (
        <label key={idx} className="flex items-center gap-2 mb-1">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={selectedAnswer === option}
            onChange={() => onSelect(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export function CheckMultiple({
  questions,
  index,
  selectedAnswer,
  onAnswerChange,
  onSelect,
}: {
  questions: Question[];
  index: number;
  selectedAnswer: string | null;
  onAnswerChange?: (text: string) => void;
  onSelect?: (answer: string) => void;
}) {
  if (index >= questions.length) {
    return <div>End of quiz!</div>;
  }

  let question: Question = questions[index];
  if (questions[index].is_multiple) {
    if (onSelect) {
      return (  <MultipleChoice
        question={question}
        onSelect={onSelect}
        selectedAnswer={selectedAnswer ?? null}
      />)
    } else {
      console.error("Missing onSelect for multiple choice question.");
      return <div>Error: No handler for multiple choice.</div>;
    }
  } else {
    if (onAnswerChange) {
      return FreeText({ question, onAnswerChange })
    } else {
      console.error("Missing onAnswerChange for free text question.");
      return <div>Error: No handler for free text question.</div>;
    }
  }
}

export function FreeText({
  question,
  onAnswerChange
}: {
  question: Question,
  onAnswerChange: (text: string) => void
}) {
  return (
    <div>
      <h2>{question.description}</h2>
      <EnhancedTextbox key={question.id} onTextChange={onAnswerChange}></EnhancedTextbox>
    </div>
  );
}


export default function QuizCard({
  questions,
  name,
  course_id,
  quiz_id,
  quiz_attempt_id,
  token,
}: {
  questions: Question[];
  name: string;
  course_id: number;
  quiz_id: number;
  quiz_attempt_id: number;
  token: string;
}) {
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Check answer");
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date().toISOString());
  const [buttonVisible, setButtonVisible] = useState(true);
  const [passed, setPassed] = useState<boolean|null>(null);
  const [passedQuiz, setPassedQuiz] = useState(true);
  const [questionAnswered, isAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [freeTextAnswer, setFreeTextAnswer] = useState('');

  useEffect(() => {
    setSelectedAnswer(null)
    setFreeTextAnswer('')
    if (index >= questions.length) {
      const time = new Date().toISOString()
      router.push(`/courses/${course_id}/${quiz_id}/ended?attempt_id=${quiz_attempt_id}&ended_at=${time}&passed=${passedQuiz}`);
    }
  }, [index])

  useEffect(() => {
    if (index >= questions.length) {
      return;
    }
    if (showAnswer && !questions[index].is_multiple) {
      setButtonVisible(false)
    }
  }, [showAnswer])

  useEffect(() => {
    if(questionAnswered == true){
      if (passed == false) {
        setPassedQuiz(false)
      }
    }
  }, [passed])

  useEffect(() => {
    if (buttonVisible == true) {
      addQuestionAttempt({
        attempt: quiz_attempt_id,
        question: questions[index].id,
        is_correct: (passed || false),
        is_multiple_choice: questions[index].is_multiple,
        free_text_answer: freeTextAnswer,
        started_at: startedAt,
        token: token
      });
    }
  }, [buttonVisible])

  return (
    <div>
      <h1 className="!text-[var(--color3)] !font-normal !text-2xl">{name}</h1>
      {index < questions.length && (
        <>
          <CheckMultiple questions={questions} index={index} onAnswerChange={setFreeTextAnswer} onSelect={setSelectedAnswer} selectedAnswer={selectedAnswer} />
          <AnswerDiv question={questions[index]} show={showAnswer} />
          {buttonVisible && (
            <button
              type="button"
              className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
              onClick={async () => {
                if (buttonText === "Check answer") {
                  if (questions[index].is_multiple && selectedAnswer === null) {
                    alert("Please select an answer before continuing.");
                    return; 
                  }
                  isAnswered(true)
                  if (questions[index].is_multiple) {
                    if (selectedAnswer == questions[index].correct_answer) { 
                      setPassed(true)
                    } else {
                      setPassed(false)
                    }
                    await addQuestionAttempt({
                      attempt: quiz_attempt_id,
                      question: questions[index].id,
                      is_correct: selectedAnswer === questions[index].correct_answer,
                      is_multiple_choice: questions[index].is_multiple,
                      free_text_answer: "",
                      started_at: startedAt,
                      token: token,
                    });
                  }
                } else {
                  setStartedAt(new Date().toISOString())
                  setIndex(index + 1)
                }
                setShowAnswer(!showAnswer)
                if (index === questions.length - 1 && buttonText === "Check answer") {
                  setButtonText("End quiz");
                } else {
                  setButtonText(prev => prev === "Check answer" ? "Next Question" : "Check answer");
                }
              }}
            >
              {buttonText}
            </button>

          )}
          {!buttonVisible && (
            <div className="flex gap-4 mt-2">
              <h2> Did you get the question right? </h2>
              <button
                type="button"
                className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
                onClick={async () => {
                  isAnswered(true)
                  setPassed(true)
                  setButtonVisible(true)
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
                onClick={async () => {
                  isAnswered(true)
                  setPassed(false)
                  setButtonVisible(true)
                }}
              >
                No
              </button>
            </div>
          )}

        </>
      )}
    </div>
  );
}

