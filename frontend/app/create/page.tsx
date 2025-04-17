import Link from 'next/link'
import Form from 'next/form'
import { get_courses } from '../lib/get_data'

type Props = {
    userId: number
}

export default function Page() {

    return (
        <div>
            <select>
                <option>Course</option>
                <option>Quiz</option>
            </select>
            <Form action="/uploadQuiz">
                {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
                <input name="courseName" />
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}
