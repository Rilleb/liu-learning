import { Question } from "@/app/data_types/data_types";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import EnhancedTextbox from "@/app/components/text_box";
import { useGameSocket } from "../sockets/gameSocketContext";
import { useSession } from "next-auth/react";


async function addQuestionAttempt({
  attempt,
  question,
  is_correct,
  is_multiple_choice,
  free_text_answer,
  started_at,
  socket,
  userId,
  username,
}: {
  attempt: number;
  question: number;
  is_correct: boolean;
  is_multiple_choice: boolean;
  free_text_answer: string;
  started_at: string;
  socket: WebSocket;
  userId: number;
  username: string
}) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/question_attempt/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    //send to backend to notify this user has moved on to next question (or wrong answer)
    socket.send(JSON.stringify({ type: "question_answered", is_correct: is_correct, username: username, user_id: userId }))

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

export function MultipleChoice({ question, onSelect }: { question: Question, onSelect: (answer: string) => void }) {
  const options = [question.correct_answer, question.alt_1, question.alt_2, question.alt_3]; // must have 3 alternatives
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return (
    <div>
      <h2>{question.description}</h2>
      {options.map((option, idx) => (
        <label key={idx} className="flex items-center gap-2 mb-1">
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
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
  onAnswerChange,
  onSelect,
}: {
  questions: Question[];
  index: number;
  onAnswerChange?: (text: string) => void;
  onSelect?: (answer: string) => void;
}) {
  if (index >= questions.length) {
    return <div>End of quiz!</div>;
  }

  let question: Question = questions[index];
  if (questions[index].is_multiple) {
    if (onSelect) {
      return MultipleChoice({ question, onSelect })
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


export default function GameQuizCard({
  questions,
  name,
  quiz_id,
  quiz_attempt_id,
  handleDone,
  timelimit,
}: {
  questions: Question[];
  name: string;
  quiz_id: number;
  quiz_attempt_id: number;
  handleDone: (passed: boolean) => void;
  timelimit: number
}) {
  const [buttonText, setButtonText] = useState("Check answer");
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false);
  const [startedAt, setStartedAt] = useState(new Date(Date.now()).toISOString());
  const [buttonVisible, setButtonVisible] = useState(true);
  const [passed, setPassed] = useState(false);
  const [passedQuiz, setPassedQuiz] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [freeTextAnswer, setFreeTextAnswer] = useState('');
  const { socket, ready } = useGameSocket()
  const { data: session, status } = useSession()
  const [timeLeft, setTimeLeft] = useState(timelimit);

  useEffect(() => {
    if (index == questions.length) {
      handleDone(passedQuiz)
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
    if (timeLeft <= 0) {
      handleDone(false); //When timer runs out the user can't have passed
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 0.3);
    }, 300);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (passed == false) {
      setPassedQuiz(false)
    }
  }, [passed])

  useEffect(() => {
    <CheckMultiple questions={questions} index={index} onSelect={setSelectedAnswer} />
    if (questions[index].is_multiple) {
      if (selectedAnswer == questions[index].correct_answer) {
        setPassed(true)
      } else {
        setPassed(false)
      }
    }

    if (buttonVisible === true && socket && ready && (selectedAnswer || freeTextAnswer) && session) {
      addQuestionAttempt({
        attempt: quiz_attempt_id,
        question: questions[index].id,
        is_correct: passed,
        is_multiple_choice: questions[index].is_multiple,
        free_text_answer: freeTextAnswer,
        started_at: startedAt,
        socket: socket,
        userId: session.user.id,
        username: session.user.username
      });
    }
  }, [buttonVisible])

  return (
    <div>
      <h1>{name}</h1>

      <div className="w-full h-4 bg-gray-300 rounded overflow-hidden mb-4">
        <div
          className="h-full bg-green-500 transition-all duration-1000"
          style={{ width: `${(timeLeft / timelimit) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{timeLeft.toFixed(0)} seconds left</p>
      {index < questions.length && (
        <>
          <CheckMultiple questions={questions} index={index} onAnswerChange={setFreeTextAnswer} onSelect={setSelectedAnswer} />
          <AnswerDiv question={questions[index]} show={showAnswer} />
          {buttonVisible && (
            <button
              type="button"
              className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
              onClick={async () => {
                if (buttonText === "Check answer") {
                  if (questions[index].is_multiple && ready && socket && session) {
                    await addQuestionAttempt({
                      attempt: quiz_attempt_id,
                      question: questions[index].id,
                      is_correct: selectedAnswer === questions[index].correct_answer,
                      is_multiple_choice: questions[index].is_multiple,
                      free_text_answer: "",
                      started_at: startedAt,
                      socket: socket,
                      userId: session.user.id,
                      username: session.user.username,
                    });
                  }
                } else {
                  setStartedAt(new Date(Date.now()).toISOString())
                  setIndex(index + 1)
                }
                setShowAnswer(!showAnswer)
                setButtonText(prev => prev === "Check answer" ? "Next Question" : "Check answer")
                if (index == questions.length - 1) {
                  setButtonText("End Quiz")
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
                onClick={() => {
                  setButtonVisible(true)
                  setPassed(true)
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
                onClick={() => {
                  setButtonVisible(true)
                  setPassed(false)
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

