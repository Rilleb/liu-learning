import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);

    if (!session) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/courses/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${session.accessToken}`,
        },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
        return res.status(backendRes.status).json({ message: 'Error fetching courses' });
    }

    return res.status(200).json(data);
}
