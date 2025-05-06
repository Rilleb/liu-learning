import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { getToken } from "next-auth/jwt"

const protectedRoutes = ["/about"]//["/courses", "/profile", "/create", "/settings"]

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !token) {
        const signInUrl = new URL("/api/auth/signin", request.url)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

// Specify paths where middleware should run
export const config = {
    matcher: ["/((?!api|_next|static|favicon.ico).*)"],
}