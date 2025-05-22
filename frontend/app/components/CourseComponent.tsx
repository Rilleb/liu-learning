'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FollowButton from './followButton'

interface Course {
  id: number
  name: string
}

interface Props {
  allCourses: Course[]
  accessToken: string
}

export default function CourseComponent({ allCourses, accessToken }: Props) {

  return (
    <div>
      <h1>All Courses</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCourses.map((course) => (
          <li
            key={course.id}
            className="border-2 border-[var(--color2)] rounded-md p-4 hover:shadow-md transition-shadow flex justify-between items-center"
          >
            <Link href={`/courses/${course.id}`} className="flex-1">
              <div className="space-y-2">
                <h3 className="hover:underline">{course.name}</h3>
              </div>
            </Link>
            <FollowButton courseId={course.id} accessToken={accessToken} />
          </li>
        ))}
      </ul>
    </div>
  )
}
