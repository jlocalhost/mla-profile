import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_me");

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth_token")?.value;

    // 1. Define protected routes
    const protectedRoutes = ["/user_dashboard", "/admin"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // 2. Define public routes that redirect to dashboard if logged in
    const isAuthRoute = pathname === "/login" || pathname === "/";

    // 3. Protected Route Logic
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.delete("auth_token");
            return response;
        }
    }

    // 4. Auth Route Logic (Redirect to dashboard if logged in)
    if (isAuthRoute && token) {
        try {
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.redirect(new URL("/user_dashboard", request.url));
        } catch (error) {
            // Token invalid, allow access to login page
        }
    }

    return NextResponse.next();
}

// Configure paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
