'use client';

import Form from 'next/form';
import { printData } from '@/app/create/actions/print_data';
import { useState } from 'react';


const QuizQuestions = () => {
    const [questions, setQuestions] = useState<string[]>(['']);

    const [answerType, setAnswerType] = useState('answer');

    const handleAddQuestions = () => {
        setQuestions([...questions, '']); // Add new input
    };

    const handleRemoveQuestions = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value; name = "questionType"
        setQuestions(newQuestions);
    };

    return (
        <div>
            <label className="block text-sm font-medium">Questions</label>
            {questions.map((questions, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        name={`question[${index}]`}
                        type="text"
                        value={questions}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="w-full border px-2 py-1 rounded"
                        placeholder={`Chapter #${index + 1}`}
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveQuestions(index)}
                        className="text-red-500 text-sm"
                    >
                        ✕
                    </button>
                    <label> Free Text </label>
                    <input type="radio" name="questionType" value="free-text" onChange={(e) => setAnswerType(e.target.value)} />
                    <label> Multiple Choice </label>
                    <input type="radio" name="questionType" value="multiple-choice" onChange={(e) => setAnswerType(e.target.value)} />
                    {answerType === 'free-text' ? <div> free </div> : <div> multiple </div>}
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddQuestions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                + Add Question
            </button>
        </div>
    )
}

export default function CreateQuestionsForm() {

    return (
        <Form action={printData} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium">Quiz Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                />
                <label className="block text-sm font-medium">Course Code</label>
                <select
                    name="courseCode"
                    required
                    className=""
                >
                    {/* TODO list actual course codes */}
                    <option> Code1 </option>
                    <option> Code2 </option>
                    <option> Code3 </option>
                </select>
                <QuizQuestions />
            </div>
        </Form>
    );
}


