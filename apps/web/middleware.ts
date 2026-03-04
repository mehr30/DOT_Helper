import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedPaths = ["/dashboard"];

// Routes that are always public
const publicPaths = [
    "/",
    "/login",
    "/register",
    "/pricing",
    "/blog",
    "/forgot-password",
    "/checkout",
    "/api/auth",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    const isPublicPath = publicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Check for better-auth session cookie
    const sessionCookie = request.cookies.get("better-auth.session_token");

    // If accessing a protected route without a session, redirect to login
    const isProtectedPath = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );

    if (isProtectedPath && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files and _next
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    ],
};
