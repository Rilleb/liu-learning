"use client";

import { useState } from 'react';
import CreateCourseForm from '../components/forms/create_course';
import CreateQuizForm from '../components/forms/create_quiz';

export default function Page() {
    const [formType, setFormType] = useState('course');

    return (
        <div className="overflow-auto flex flex-col items-center">
            {/* Dropdown */}
            <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="border p-2 rounded mb-4 w-48"
            >
                <option value="course"> Course </option>
                <option value="quiz"> Quiz </option>
            </select>

            {/*Forms*/}
            <div className="overflow-auto w-full max-w-2xl px-4">
                <h1>Create new {formType}</h1>
                {formType === 'course' ? <CreateCourseForm /> : <CreateQuizForm />}
            </div>
        </div>
    );
}
