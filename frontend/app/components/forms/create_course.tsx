'use client'

import { useState } from 'react';
import { createCourse } from './actions/course_action';

export default function CreateCourseForm() {
    const [chapters, setChapters] = useState<string[]>(['']);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('')

    const handleAddChapter = () => {
        setChapters([...chapters, '']);
    };

    const handleRemoveChapter = (index: number) => {
        const newChapters = chapters.filter((_, i) => i !== index);
        setChapters(newChapters);
    };

    const handleChapterChange = (index: number, value: string) => {
        const newChapters = [...chapters];
        newChapters[index] = value;
        setChapters(newChapters);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await createCourse({ title, code, description, chapters });

        if (res.success) {
            setStatus("Succesfully created course")
        } else {
            // const data = await res.json()data.message 
            setStatus('Failed to create course')
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium">Course Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Course Code</label>
                <input
                    name="courseCode"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    required
                    className="w-full border px-2 py-1 rounded"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className='space-y-2 border-2 border-[var(--color3)] rounded-md p-3'>
                <label className="block text-sm font-medium">Chapters</label>
                {chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <input
                            name={`chapters[${index}]`}
                            type="text"
                            value={chapter}
                            onChange={(e) => handleChapterChange(index, e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder={`Chapter #${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveChapter(index)}
                            className="text-[var(--color_red)] text-sm py-2"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleAddChapter}
                        className="bg-[var(--color2)] text-white px-2 py-1.5 rounded hover:bg-[var(--color3)]"
                    >
                        + Add Chapter
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-[var(--color_green)] text-white px-4 py-2 rounded hover:bg-[var(--color_green_hover)]"
                >
                    Create Course
                </button>
                {status && <p>{status}</p>}
            </div>   
        </Form>
    );
}


