import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // الصفحات المحمية
  const protectedPaths = [
    "/profile", 
    "/courses/create", 
    "/my-courses", 
    "/admin", 
    "/instructor",
    "/courses/manage"
  ];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // لو بيحاول يفتح صفحة محمية ومفيش Refresh Token، نطرده للـ Login
  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/courses/create/:path*",
    "/my-courses/:path*",
    "/admin/:path*",
    "/instructor/:path*",
    "/courses/manage/:path*",
  ],
};