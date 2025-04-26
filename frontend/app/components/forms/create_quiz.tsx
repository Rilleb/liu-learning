'use client';

import Form from 'next/form';
import { printData } from '@/app/create/actions/print_data';

export default function CreateQuizForm() {
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
            </div>
        </Form>
    );
}


