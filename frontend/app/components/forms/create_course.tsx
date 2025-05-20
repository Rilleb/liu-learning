'use client';

import Form from 'next/form';
import { useState } from 'react';
import { printData } from '@/app/create/actions/print_data';

export default function CreateCourseForm() {
    const [chapters, setChapters] = useState<string[]>(['']);

    const handleAddChapter = () => {
        setChapters([...chapters, '']); // Add new input
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

    return (
        <Form action={printData} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium">Course Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Course Code</label>
                <input
                    name="courseCode"
                    type="text"
                    required
                    className="w-full border px-2 py-1 rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    required
                    className="w-full border px-2 py-1 rounded"
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
            </div>   
        </Form>
    );
}


