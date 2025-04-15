import { User, Course } from "../data_types/data_types";

const userMap = new Map<number, User>([
  [
    1,
    {
      userId: 1,
      name: "Alice",
      courses: [101, 205],
      friends: [2, 3],
    },
  ],
  [
    2,
    {
      userId: 2,
      name: "Bob",
      courses: [101, 301],
      friends: [1],
    },
  ],
  [
    3,
    {
      userId: 3,
      name: "Rille",
      courses: [101],
      friends: [1, 2],
    },
  ],
]);

const exampleCourses: Course[] = [
  {
    courseId: 101,
    title: "Introduction to Computer Science",
    quizes: [1, 2, 3, 4],
  },
  {
    courseId: 205,
    title: "Advanced Data Structures",
    quizes: [5, 6, 7],
  },
  {
    courseId: 301,
    title: "Machine Learning Fundamentals",
    quizes: [8, 9, 10, 11, 12],
  },
  {
    courseId: 1,
    title: "Basic Mathematics for Computing",
    quizes: [13, 14],
  },
];

export function get_user(userId: number) {
  return userMap.get(userId);
}

export function get_courses(userId: number) {
  const user = get_user(userId);
  const courseIds = user?.courses;
  if (courseIds) {
    return exampleCourses.filter((course) =>
      courseIds.includes(course.courseId),
    );
  } else {
    return {};
  }
}
