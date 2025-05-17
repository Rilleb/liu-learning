"use client"

import { Question } from "./../data_types/data_types"
import { useState, useEffect} from "react";
import EnhancedTextbox from './text_box';
import { useRouter } from 'next/navigation';

async function addQuestionAttempt({
    attempt,
    question,
    is_correct,
    is_multiple_choice,
    free_text_answer,
    started_at,
  }: {
    attempt: number;
    question: number;
    is_correct: boolean;
    is_multiple_choice: boolean; 
    free_text_answer: string;
    started_at: string;
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
  
      const data = await res.text();
      console.log("Question attempt recorded:", data);
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
    if(show){
        return  (
            <div>
                <h2>The correct answer is: {question.answer} </h2>
            </div>
        );
    }
    return  (
        <div>
        </div>
    );
}

export function MultipleChoice({ question, onSelect}: {  question: Question, onSelect: (answer: string) => void}) {
  const options = [question.answer, question.alternatives.alt1, question.alternatives.alt2, question.alternatives.alt3]; // must have 3 alternatives
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return (
      <div>
         <h2>{question.question}</h2>
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

    let question : Question = questions[index];
    if(questions[index].is_multiple){
      if(onSelect){
        return MultipleChoice({question, onSelect})
      }else {
        console.error("Missing onSelect for multiple choice question.");
        return <div>Error: No handler for multiple choice.</div>;
      }
    }else{
      if(onAnswerChange){
        return FreeText( {question, onAnswerChange})
      }else {
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
            <h2>{question.question}</h2>
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
  }: {
    questions: Question[];
    name: string;
    course_id: number;
    quiz_id: number;
    quiz_attempt_id: number;
  }) {
    const router = useRouter(); 
    const [buttonText, setButtonText] = useState("Check answer");
    const [index, setIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false);
    const [startedAt, setStartedAt] = useState(new Date().toISOString());
    const [buttonVisible, setButtonVisible] = useState(true);
    const [passed, setPassed] = useState(false);
    const [passedQuiz, setPassedQuiz] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [freeTextAnswer, setFreeTextAnswer] = useState('');

    useEffect(() => {
        if(index == questions.length - 1){
            setButtonText("End quiz")
        }
        if(index >= questions.length){
            const time = new Date().toISOString()
            router.push(`/courses/${course_id}/${quiz_id}/ended?attempt_id=${quiz_attempt_id}&ended_at=${time}&passed=${passed}`);
        }
    }, [index])

    useEffect(()=>{
        if( index >= questions.length){
          return;
        }
        if(showAnswer && !questions[index].is_multiple){
            setButtonVisible(false)
        }
    }, [showAnswer])

    useEffect(()=>{
      if(passed == false){
        setPassedQuiz(false)
      }
    }, [passed])

    useEffect(()=>{
        <CheckMultiple questions={questions} index={index} onSelect={setSelectedAnswer} />
        if(questions[index].is_multiple){
            if(selectedAnswer == questions[index].answer){
              setPassed(true)
            } else{
              setPassed(false)
            }
        }

        if(buttonVisible === true){
          addQuestionAttempt({
              attempt: quiz_attempt_id,
              question: questions[index].id,
              is_correct: passed,
              is_multiple_choice: questions[index].is_multiple, 
              free_text_answer: freeTextAnswer, 
              started_at: startedAt,
          });
        }
    }, [buttonVisible])
    
    return (
        <div>
            <h1>{name}</h1>
            {index < questions.length && (
                <>
                    <CheckMultiple questions={questions} index={index} onAnswerChange={setFreeTextAnswer} onSelect={setSelectedAnswer} />
                    <AnswerDiv question={questions[index]} show={showAnswer} />
                    {buttonVisible && (
                        <button
                            type="button"
                            className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
                            onClick={async () => {
                                if(buttonText === "Check answer"){
                                  if(questions[index].is_multiple){
                                    await addQuestionAttempt({
                                        attempt: quiz_attempt_id,
                                        question: questions[index].id,
                                        is_correct: selectedAnswer === questions[index].answer, 
                                        is_multiple_choice: questions[index].is_multiple, 
                                        free_text_answer: "", 
                                        started_at: startedAt,
                                    });
                                  }
                                } else {
                                    setStartedAt(new Date().toISOString())
                                    setIndex(index+1)
                                }
                                setShowAnswer(!showAnswer)
                                setButtonText(prev => prev === "Check answer" ? "Next Question" : "Check answer")
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
                              setButtonVisible(true)
                              setPassed(true)
                            } }
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="text-white bg-[var(--color2)] hover:bg-[var(--color3)] px-4 py-2 transition-all rounded place-self-end"
                            onClick={async () => { 
                              setButtonVisible(true)
                              setPassed(false)
                            } }
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

