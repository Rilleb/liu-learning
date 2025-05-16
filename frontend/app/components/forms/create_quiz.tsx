'use client';

import { useState, useEffect } from 'react';
import { createQuiz } from './actions/quiz_action';
import { Course } from '@/app/data_types/data_types';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

type MultipleChoiceAnswerProps = {
    index: number;
    answers: string[][];
    setAnswers: React.Dispatch<React.SetStateAction<string[][]>>;
};

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({ index, answers, setAnswers }) => {
    const handleMultipleChoiceAnswerChange = (choiceIndex: number, value: string) => {
        const newAnswers = [...answers];
        const currentAnswers = [...(newAnswers[index] || ['', '', '', ''])];
        currentAnswers[choiceIndex] = value;
        newAnswers[index] = currentAnswers;
        setAnswers(newAnswers);
    };


    return (
        /* Use string[string[]] for answers ??? */
        <div className="grid grid-cols-1 gap-2 my-2">
            <input
                name={`question[${index}].correctAnswer`}
                type="text"
                placeholder="Alternative 1 (correct answer)"
                className="border px-2 py-1 rounded"
                onChange={(e) => handleMultipleChoiceAnswerChange(0, e.target.value)}
            />
            <input
                name={`question[${index}].alternative1`}
                type="text"
                placeholder="Alternative 2"
                className="border px-2 py-1 rounded"
                onChange={(e) => handleMultipleChoiceAnswerChange(1, e.target.value)}
            />
            <input
                name={`question[${index}].alternative2`}
                type="text"
                placeholder="Alternative 3"
                className="border px-2 py-1 rounded"
                onChange={(e) => handleMultipleChoiceAnswerChange(2, e.target.value)}
            />
            <input
                name={`question[${index}].alternative3`}
                type="text"
                placeholder="Alternative 4"
                className="border px-2 py-1 rounded"
                onChange={(e) => handleMultipleChoiceAnswerChange(3, e.target.value)}
            />
        </div>
    );
};

type QuizQuestionsProps = {
    questions: string[];
    setQuestions: React.Dispatch<React.SetStateAction<string[]>>;
    answerTypes: string[];
    setAnswerType: React.Dispatch<React.SetStateAction<string[]>>;
    answers: string[][];
    setAnswers: React.Dispatch<React.SetStateAction<string[][]>>;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({
    questions,
    setQuestions,
    answerTypes,
    setAnswerType,
    answers,
    setAnswers
}) => {

    const handleAnswerTypeChange = (index: number, type: string) => {
        const newAnswerTypes = [...answerTypes];
        newAnswerTypes[index] = type;
        setAnswerType(newAnswerTypes);
    };


    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
        setAnswerType([...answerTypes, '']);
        setAnswers([...answers, ['', '', '', '']]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        const newAnswerTypes = answerTypes.filter((_, i) => i !== index);
        const newAnswers = answers.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        setAnswerType(newAnswerTypes);
        setAnswers(newAnswers);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleFreeTextAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = [value];
        setAnswers(newAnswers);
    };

    return (
        <div className="space-y-6 mt-4">
            <label className="block text-sm font-medium">Questions</label>
            {questions.map((question, index) => (
                <div key={index} className="border p-4 rounded space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            name={`question[${index}].title`}
                            type="text"
                            value={question}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder={`Question #${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-red-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name={`questionType-${index}`}
                                value="free-text"
                                checked={answerTypes[index] !== 'multiple-choice'}
                                onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
                            /> Free Text
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={`questionType-${index}`}
                                value="multiple-choice"
                                checked={answerTypes[index] === 'multiple-choice'}
                                onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
                            /> Multiple Choice
                        </label>
                    </div>

                    {answerTypes[index] === 'multiple-choice' ? (
                        <MultipleChoiceAnswer index={index} answers={answers} setAnswers={setAnswers} />
                    ) : (
                        <textarea
                            name={`question[${index}].freeTextAnswer`}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Enter expected free text answer"
                            onChange={(e) => handleFreeTextAnswerChange(index, e.target.value)}
                        />
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                + Add Question
            </button>
        </div>
    )
}

export default function CreateQuizForm() {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [answerTypes, setAnswerType] = useState<string[]>(['']);
    const [questions, setQuestions] = useState<string[]>(['']);
    const [answers, setAnswers] = useState<string[][]>([['']]);
    const [status, setStatus] = useState('')
    const [courses, setCourses] = useState<Course[]>([])

    useEffect(() => {
        const fetchCourses = async () => {

            const session = await getServerSession(options)
            if (!session) {
                return (
                    <div>
                        <p>Could not fetch courses, no logged in user</p>
                    </div>
                )
            }
            const res = await fetch(`${process.env.BACKEND_URL}/api/courses/`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Token ${session.accessToken}`,
                },
                cache: 'no-store', // optional: prevents Next.js from caching the fetch
            })

            if (!res.ok) {
                return <div>Error fetching courses</div>
            }
            const data = await res.json();
            setCourses(data);
        };

        fetchCourses();

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()

            // const res = await createQuiz({   });
            //
            // if (res.success) {
            //     setStatus("Succesfully created course")
            // } else {
            //     // const data = await res.json()data.message 
            //     setStatus('Failed to create course')
            // }
        };
    })

    return (
        /* ADD onSubmit later */
        <form className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium">Quiz Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label className="block text-sm font-medium">Course </label>
                <select
                    name="courseCode"
                    required
                    className="w-full border px-2 py-1 rounded"
                    onChange={(e) => setCode(e.target.value)}
                >
                    {}
                    <option> Select a course</option>
                    {courses.map((course, i) => (
                        <option key={i} value={course.name}>
                            {course.name}
                        </option>
                    ))}
                </select>
                <QuizQuestions
                    questions={questions}
                    setQuestions={setQuestions}
                    answerTypes={answerTypes}
                    setAnswerType={setAnswerType}
                    answers={answers}
                    setAnswers={setAnswers}
                />
            </div>
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Create Quiz
            </button>
            {status && <p>{status}</p>}
        </form>
    );
}


