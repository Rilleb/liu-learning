import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
    return (
        <div className="w-full bg-[var(--foreground)] h-12">
            <Link href="/user_profile" className="float-right">
                <Image
                    src="/globe.svg"
                    width="30"
                    height="30"
                    alt="profile picture"
                ></Image>
            </Link>
        </div>
    )
}
