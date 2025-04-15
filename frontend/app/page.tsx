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
    <div>
      <ul>
        {courses && courses?.map((course, _) => {
          const completion = course.completedQuizes.length / course.quizes.length
          return <li key={course.courseId}>
            <Link href={`/course/${course.courseId}`}>
              <p>Name: {course.title}</p>  {/*This should probably be a Link somewhere around here*/}
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
    <div className="container m-auto grid grid-cols-2">
      {/*Quizes*/}
      <div>
        <QuizComponent userId={userId} />
      </div>
      {/*Friends*/}
      <div className="tile-marker">
        <h2>Friends</h2>
        {user_data?.friends.map((id) => {
          const tmp = get_user(id);
          return <p key={id}>{tmp?.name}</p>
        })}
      </div>
      {/*Courses*/}
      <div className="tile-marker">
        <CourseComponent userId={userId} />
      </div>
    </div>

  );
}
