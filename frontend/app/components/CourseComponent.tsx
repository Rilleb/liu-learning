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
            {/* <button */}
            {/*   onClick={() => toggleFollow(course)} */}
            {/*   className={`ml-4 text-xl px-3 py-1 rounded-full transition-all border hover:opacity-90 ${isFollowed(course.id) */}
            {/*     ? 'bg-[var(--color3)] text-[var(--foreground)] border-[var(--color2)]' */}
            {/*     : 'bg-[var(--color1)] text-white border-[var(--color2)]' */}
            {/*     }`} */}
            {/*   title={isFollowed(course.id) ? 'Unfollow course' : 'Follow course'} */}
            {/* > */}
            {/*   {isFollowed(course.id) ? '✓' : '+'} */}
            {/* </button> */}
          </li>
        ))}
      </ul>
    </div>
  )
}
