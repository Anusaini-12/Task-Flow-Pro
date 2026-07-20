import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                      request.nextUrl.pathname.startsWith("/signup");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (!sessionCookie && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};