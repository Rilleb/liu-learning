import Image from "next/image";
import { get_courses, get_user } from "./lib/get_data";

export default function Home() {
  const userId = 1;
  const user_data = get_user(userId);
  const courses = get_courses(userId);

  return (
    <div>
      {/*Quizes*/}
      <div>
      </div>
      {/*Friends*/}
      <div>
        <h2>Friends</h2>
        {user_data?.friends.map((id) => {
          const tmp = get_user(id);
          return <p key={id}>{tmp?.name}</p>
        })}
      </div>
      {/*Courses*/}
      <div>

      </div>
    </div>

  );
}
