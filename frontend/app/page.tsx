import { get_courses, get_latest_quizes, get_user } from "./lib/get_data";
import ProgressBar from "./components/progress_bar";
import Link from "next/link";

type Props = {
  userId: number
}

const CourseComponent = ({ userId }: Props) => {
  /*
   * Fetching data should be done in one step, think I saw something about it in the next.js tutorial so we use parallel fetching to make it faster
   * Probably not something we need to do now, but perhaps later
   * */
  const courses = get_courses(userId);

  return (
    <div className="font-medium ">
      <ul>
        {courses && courses?.map((course, _) => {
          const completion = course.completedQuizes.length / course.quizes.length
          return <li key={course.courseId} className={"border-2 border-gray-200 rounded-md m-4"}>
            <Link href={`/course/${course.courseId}`}>
              <h1>{course.title}</h1>  {/*This should probably be a Link somewhere around here*/}
              <ProgressBar progress={completion} />
            </Link>
          </li>;
        })}
      </ul>
    </div>
  )
}

const QuizComponent = ({ userId }: Props) => {
  const quizes = get_latest_quizes(6);
  return (
    <div>
      <ul>
        {quizes && quizes.map((quiz) => {
          return <li key={quiz.quizId}>
            <Link href={"/quiz_that_needs_to_change"}>
              <p>Quiz: {quiz.name} </p>
            </Link>
          </li>
        })}
      </ul>
    </div>
  )
}

export default function Home() {
  const userId = 1;
  const user_data = get_user(userId);

  return (
    /*I'm not sure if we're going to use grid-but this seems to be quite a good site for it: https://refine.dev/blog/tailwind-grid/#reorder-regions*/
    <div className="container h-full m-auto grid gap-4 grid-cols-2 lg:grid-cols-3 lg:grid-rows-5 flex">
      {/*Quizes*/}
      <div className="tile-marker col-span-2 border-2 row-span-2 rounded-sm shadow-lg border-gray-300 p-4">
        <QuizComponent userId={userId} />
      </div>
      {/*Friends*/}
      <div className="tile-marker col-span-1 col-start-3 border-2 row-span-4 rounded-sm shadow-lg border-gray-300 p-4">
        <h2>Friends</h2>
        {user_data?.friends.map((id) => {
          const tmp = get_user(id);
          return <p key={id}>{tmp?.name}</p>
        })}
      </div>
      {/*Courses*/}
      <div className="tile-marker col-span-2 border-2 md-col-span-2 row-span-2 rounded-sm shadow-lg border-gray-300 p-4">
        <CourseComponent userId={userId} />
      </div>
    </div>

  );
}
