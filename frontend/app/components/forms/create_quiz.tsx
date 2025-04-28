'use client';

import Form from 'next/form';
import { printData } from '@/app/create/actions/print_data';
import { useState } from 'react';

const MultipleChoiceAnswer = () => {
    return (
        <div className='grid-cols-2'>
            <input
                name="correctAnswer"
                type="text"
                placeholder="Alternative 1 (correct)"
            />
            <input
                name="alternative1"
                type="text"
                placeholder="Alternative 1"
            />
            <input
                name="alternative2"
                type="text"
                placeholder="Alternative 2"
            />
            <input
                name="alternative3"
                type="text"
                placeholder="Alternative 3"
            />
        </div>
    )
}

const QuizQuestions = () => {
    const [answerType, setAnswerType] = useState<string[]>(['']);

    const handleAnswerTypeChange = (index: number, type: string) => {
        const newAnswerTypes = [...answerType];
        newAnswerTypes[index] = type;
        setAnswerType(newAnswerTypes);
    };

    const [questions, setQuestions] = useState<string[]>(['']);

    const handleAddQuestions = () => {
        setQuestions([...questions, '']);
        setAnswerType([...answerType, '']);
    };

    const handleRemoveQuestions = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        const newAnswerTypes = answerType.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        setAnswerType(newAnswerTypes);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    return (
        <div className='items-center'>
            <label className="block text-sm font-medium">Questions</label>
            {questions.map((questions, index) => (
                <div key={index} >
                    <div className="flex items-center gap-2">
                        <input
                            name={`question[${index}]`}
                            type="text"
                            value={questions}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder={`Question #${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveQuestions(index)}
                            className="text-red-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                    <label> Free Text </label>
                    <input
                        type="radio"
                        name={`questionType-${index}`}
                        value="free-text"
                        onChange={(e) => handleAnswerTypeChange(index, e.target.value)} />
                    <label> Multiple Choice </label>
                    <input
                        type="radio"
                        name={`questionType-${index}`}
                        value="multiple-choice"
                        onChange={(e) => handleQuestionChange(index, e.target.value)} />

                    {answerType[index] === 'multiple-choice' ? (
                        <MultipleChoiceAnswer />
                    ) : (
                        <>
                            <div className='grid-cols-1'>
                                <textarea name="free-text-answer" />
                            </div>
                        </>
                    )}
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


