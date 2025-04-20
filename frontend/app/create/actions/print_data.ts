'use server'

import { redirect } from 'next/navigation'

export async function printData(formData: FormData) {
    // TODO: save to database
    console.log('Creating course:', { FormData })

    // Optional: redirect after creation
    redirect('')
}
