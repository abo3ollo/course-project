import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ✅ اقرأ الكوكي من الـ request
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // ── الصفحات المحمية ──
  const protectedPaths = ["/profile", "/courses/create", "/my-courses"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── صفحات الـ auth (لو داخل، مش محتاج يفتحها) ──
  const authPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/courses/create/:path*",
    "/my-courses/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};