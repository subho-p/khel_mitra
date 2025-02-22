import { ACCESS_TOKEN_NAMESPACE } from "@khel-mitra/shared/constanst";

import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "./lib/routes";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);

async function checkAuth(req: NextRequest): Promise<boolean> {
    const token = req.cookies.get(ACCESS_TOKEN_NAMESPACE)?.value;
    if (!token) return false;

    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch (error) {
        console.error("JWT validation error:", error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isAuthenticated = await checkAuth(request);

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", origin));
    }

    if (!isPublicRoute && !isAuthRoute && !isAuthenticated) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/auth/signin?callback=${callbackUrl}`, origin),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
