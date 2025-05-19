'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Course {
  id: number
  name: string
}

interface Props {
  allCourses: Course[]
  followedCoursesInitial: Course[]
  accessToken: string
}

export default function CourseComponent({ allCourses, followedCoursesInitial, accessToken }: Props) {
  const [followedCourses, setFollowedCourses] = useState<Course[]>(followedCoursesInitial)

  const isFollowed = (courseId: number) =>
    followedCourses.some((c) => c.id === courseId)

  const toggleFollow = async (course: Course) => {
    const followed = isFollowed(course.id)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/follow/`, {
      method: followed ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${accessToken}`,
      },
      body: JSON.stringify({ courseId: course.id }),
    })

    if (!res.ok) return alert('Failed to toggle follow')

    setFollowedCourses((prev) =>
      followed
        ? prev.filter((c) => c.id !== course.id)
        : [...prev, course]
    )
  }

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
            <button
              onClick={() => toggleFollow(course)}
              className={`ml-4 text-xl px-3 py-1 rounded-full transition-all ${isFollowed(course.id)
                ? 'bg-red-100 text-red-600 border border-red-400 hover:bg-red-200'
                : 'bg-green-100 text-green-600 border border-green-400 hover:bg-green-200'
                }`}
              title={isFollowed(course.id) ? 'Unfollow course' : 'Follow course'}
            >
              {isFollowed(course.id) ? '✓' : '+'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
