'use client';

import { useState } from 'react';
import { printData } from '@/app/create/actions/print_data';

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

        const res = await fetch("http://localhost:8000/api/courses/",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "title": title, "code": code, "description": description, "chapters": chapters }),
            })

        if (res.ok) {
            setStatus("Succesfully created course")
        } else {
            // const data = await res.json()data.message 
            setStatus('Failed to create course')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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

            <div>
                <label className="block text-sm font-medium">Chapters</label>
                {chapters.map((chapter, index) => (
                    <div key={index} className="flex items-center gap-2">
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
                            className="text-red-500 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddChapter}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Chapter
                </button>
            </div>

            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Create Course
            </button>
            {status && <p>{status}</p>}
        </form>
    );
}


