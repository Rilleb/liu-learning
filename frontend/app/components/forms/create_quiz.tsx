'use client';

import Form from 'next/form';
import { printData } from '@/app/create/actions/print_data';
import { useState } from 'react';

type MultipleChoiceAnswerProps = {
    index: number;
};

const MultipleChoiceAnswer: React.FC<MultipleChoiceAnswerProps> = ({ index }) => {
    return (
        <div className="grid grid-cols-1 gap-2 my-2">
            <input
                name={`question[${index}].correctAnswer`}
                type="text"
                placeholder="Correct Answer"
                className="border px-2 py-1 rounded"
            />
            <input
                name={`question[${index}].alternative1`}
                type="text"
                placeholder="Alternative 1"
                className="border px-2 py-1 rounded"
            />
            <input
                name={`question[${index}].alternative2`}
                type="text"
                placeholder="Alternative 2"
                className="border px-2 py-1 rounded"
            />
            <input
                name={`question[${index}].alternative3`}
                type="text"
                placeholder="Alternative 3"
                className="border px-2 py-1 rounded"
            />
        </div>
    );
};

const QuizQuestions = () => {
    const [answerTypes, setAnswerType] = useState<string[]>(['']);

    const handleAnswerTypeChange = (index: number, type: string) => {
        const newAnswerTypes = [...answerTypes];
        newAnswerTypes[index] = type;
        setAnswerType(newAnswerTypes);
    };

    const [questions, setQuestions] = useState<string[]>(['']);

    const handleAddQuestion = () => {
        setQuestions([...questions, '']);
        setAnswerType([...answerTypes, '']);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        const newAnswerTypes = answerTypes.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        setAnswerType(newAnswerTypes);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    return (
        <div className="space-y-6 mt-4">
            <label className="block text-sm font-medium">Questions</label>
            {questions.map((question, index) => (
                <div key={index} className="border-2 border-[var(--color3)] p-4 rounded space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            name={`question[${index}].text`}
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
                        <MultipleChoiceAnswer index={index} />
                    ) : (
                        <textarea
                            name={`question[${index}].freeTextAnswer`}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Enter expected free text answer"
                        />
                    )}
                </div>
            ))}
            <div className='flex justify-end'> 
                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-[var(--color2)] text-white px-4 py-2 rounded hover:bg-[var(--color3)]"
                >
                    + Add Question
                </button>
            </div>
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
                <label className="block text-sm font-medium">Course </label>
                <select
                    name="courseCode"
                    required
                    className="w-full border px-2 py-1 rounded"
                >
                    {/* TODO list actual course codes */}
                    <option> Select a course</option>
                    <option> Code1 </option>
                    <option> Code2 </option>
                    <option> Code3 </option>
                </select>
                <QuizQuestions />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-[var(--color_green)] text-white px-4 py-2 rounded hover:bg-[var(--color_green_hover)]"
                >
                    Create Quiz
                </button>
            </div>   
        </Form>
    );
}


