import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="h-screen w-1/8 bg-red-400 float-left">
      <ul>
        <li>
          <Link href="/user_profile" className="text-red-900">
            länk 1
          </Link>
        </li>
        <li>
          <Link href="/user_profile" className="text-red-900">
            länk 2
          </Link>
        </li>
        <li>
          <Link href="/user_profile" className="text-red-900">
            länk 3
          </Link>
        </li>
      </ul>
    </div>
  );
}
