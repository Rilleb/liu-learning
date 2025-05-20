'use server';

import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { Chapter, Course } from '@/app/data_types/data_types';


export async function getChapters({ course }: {
    course: Course;
}) {
    const session = await getServerSession(options);

    if (!session) {
        return { success: false, message: 'Not authenticated' };
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/courses/chapters/?id=${course.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
    });

    const data: Chapter[] = await res.json();

    if (!res.ok) {
        return { success: false, message: 'Failed to get course chapters' };
    }

    return { success: true, message: 'Successfully fetched all chapters from course', data: data };
}
