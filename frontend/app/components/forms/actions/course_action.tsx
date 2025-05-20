'use server';

import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';


export async function createCourse({ title, code, description, chapters }: {
    title: string;
    code: string;
    description: string;
    chapters: string[];
}) {
    const session = await getServerSession(options);

    if (!session) {
        return { success: false, message: 'Not authenticated' };
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/courses/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
        body: JSON.stringify({ title, code, description, chapters }),
    });

    if (!res.ok) {
        return { success: false, message: 'Failed to create course' };
    }

    return { success: true, message: 'Successfully created course' };
}
