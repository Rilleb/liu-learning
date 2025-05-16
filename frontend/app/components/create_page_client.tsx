
// components/create_page_client.tsx
"use client";

import { useState } from "react";
import CreateCourseForm from "./forms/create_course";
import CreateQuizForm from "./forms/create_quiz";
import { Course } from "@/app/data_types/data_types";

type Props = {
  courses: Course[];
};

export default function CreatePageClient({ courses }: Props) {
  const [formType, setFormType] = useState("course");

  return (
    <div className="overflow-auto flex flex-col items-center">
      {/* Dropdown */}
      <select
        value={formType}
        onChange={(e) => setFormType(e.target.value)}
        className="border p-2 rounded mb-4 w-48"
      >
        <option value="course">Course</option>
        <option value="quiz">Quiz</option>
      </select>

      <div className="overflow-auto w-full max-w-2xl px-4">
        <h1>Create new {formType}</h1>
        {formType === "course" ? (
          <CreateCourseForm />
        ) : (
          <CreateQuizForm courses={courses} />
        )}
      </div>
    </div>
  );
}
