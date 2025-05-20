'use client'

import { useState, useEffect } from "react"


export default function FollowButton({ courseId, accessToken }: { courseId: number, accessToken: string }) {
  const [isFollowed, setIsFollowed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkFollowStatus = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/`, {
        headers: {
          'Authorization': `Token ${accessToken}`,
        }
      })
      if (res.ok) {
        const followedCourses = await res.json()
        setIsFollowed(followedCourses.some((c: any) => c.id === courseId))
      }
      setLoading(false)
    }
    checkFollowStatus()
  }, [courseId, accessToken])

  const toggleFollow = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/follow/`, {
      method: isFollowed ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${accessToken}`,
      },
      body: JSON.stringify({ courseId: courseId }),
    })

    if (res.ok) {
      setIsFollowed(!isFollowed)
    }
  }

  if (loading) return null

  return (
    <button
      onClick={toggleFollow}
      className={`ml-4 text-xl px-3 py-1 rounded-full transition-all border hover:opacity-90 ${isFollowed
        ? 'bg-[var(--color3)] text-[var(--foreground)] border-[var(--color2)]'
        : 'bg-[var(--color1)] text-white border-[var(--color2)]'
        }`}
    >
      {isFollowed ? 'Unfollow -' : 'Follow +'}
    </button>
  )
}
