'use server'

import { redirect } from 'next/navigation'

export async function printData(formData: FormData) {
    // TODO: save to database
    const data: Record<string, string> = {}

    for (const [key, value] of formData.entries()) {
        data[key] = value.toString() // Convert File objects to string if needed
    }

    console.log('📋 Submitted Form Data:', data)

    // Optional: redirect after creation
    // redirect('/')
}
