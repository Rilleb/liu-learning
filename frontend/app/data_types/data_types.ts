/*Basic example on how a course might look*/
export interface Course {
  courseId: number;
  title: string;
  quizes: number[];
}

/*Basic example of how a user might look*/
export interface User {
  userId: number;
  name: string;
  courses: number[];
  friends: number[];
}
