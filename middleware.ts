import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export const config = {
  matcher: ["/admin/:path*", "/letter/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isLetterRoute = pathname.startsWith("/letter");

  if (isAdminRoute && session?.role !== "admin") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLetterRoute && session?.role !== "user") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
