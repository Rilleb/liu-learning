
// app/create/page.tsx
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import CreatePageClient from "@/app/components/create_page_client";

export default async function CreatePage() {
    const session = await getServerSession(options);

    if (!session) {
        return <p>Not logged in</p>;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/?all=true`, {
        headers: {
            'Authorization': `Token ${session.accessToken}`,
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    const courses = await res.json();
    console.log(courses)

    return <CreatePageClient courses={courses} />;
}

