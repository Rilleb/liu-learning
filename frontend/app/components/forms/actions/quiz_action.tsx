'use server';

import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { Chapter, Course } from '@/app/data_types/data_types';

export async function createQuiz({ title, course, selectedChapter, questions, answerTypes, answers }: {
    title: string;
    course: Course;
    selectedChapter: Chapter;
    questions: string[];
    answerTypes: string[];
    answers: string[][];
}) {
    const session = await getServerSession(options);

    if (!session) {
        return { success: false, message: 'Not authenticated' };
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/quiz/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
        // TODO: send id's instead of whole course and fetch it on the backend
        body: JSON.stringify({ title, course, selectedChapter, questions, answerTypes, answers }),
    });

    if (!res.ok) {
        return { success: false, message: 'Failed to create course' };
    }

    return { success: true, message: 'Successfully created course' };
}
