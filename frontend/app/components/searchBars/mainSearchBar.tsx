import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { CourseList, QuizList, Course, Quiz } from "../data_types/data_types";
import Link from "next/link";


export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [courseResults, setCourseResults] = useState<CourseList>([]);
  const [quizResults, setQuizResults] = useState<QuizList>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (q: string) => {
    setQuery(q);
    handleSearch(q);
  };

  const handleSearch = useDebounceCallback(async (q: string) => {
    if (!q.trim()) {
      setCourseResults([]);
      setQuizResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);

    try {
      const [courseRes, quizRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/search/?query=${q}`, {
          headers: {
            'Content-type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/quiz/search/?query=${q}`, {
          headers: { 'Content-type': 'application/json', },
        }),
      ]);

      if (courseRes.ok) {
        const courses: CourseList = await courseRes.json();
        setCourseResults(courses);
      }

      if (quizRes.ok) {
        const quizzes: QuizList = await quizRes.json();
        setQuizResults(quizzes);
      }

      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white rounded-md px-3 py-1 border border-gray-300">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => {
            // Small delay to allow clicks in the dropdown before hiding
            setTimeout(() => setShowDropdown(false), 150);
          }}
          onFocus={() => {
            if ((courseResults.length > 0 || quizResults.length > 0) && query.trim()) {
              setShowDropdown(true);
            }
          }}
          placeholder="Search courses or quizzes..."
          className="flex-grow px-3 py-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        {loading && <div className="text-sm text-gray-500 ml-2">Loading...</div>}
      </div>

      {showDropdown && (courseResults.length > 0 || quizResults.length > 0) && (
        <div className="absolute z-10 bg-white w-full mt-2 rounded-md shadow-md border border-gray-200 max-h-60 overflow-auto">
          <div className="p-2">
            {courseResults.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Courses</h4>
                <ul>
                  {courseResults.map((course: Course) => (
                    <li key={course.id} className="hover:bg-gray-100 px-2 py-1 rounded">

                      <Link href={`/courses/${course.id}`} className="block">
                        {`${course.name} - ${course.code}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {quizResults.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-gray-700 mt-3 mb-1">Quizzes</h4>
                <ul>
                  {quizResults.map((quiz: Quiz) => (
                    <li key={quiz.id} className="hover:bg-gray-100 px-2 py-1 rounded">
                      <Link href={`/courses/${quiz.course.id}/${quiz.id}`} className="block">
                        {`${quiz.name} (${quiz.course.code})`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {courseResults.length === 0 && quizResults.length === 0 && (
              <div className="text-gray-500 text-sm">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
