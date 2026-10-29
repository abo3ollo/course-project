import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // ── الصفحات المحمية ──
  const protectedPaths = [
    "/profile", 
    "/courses/create", 
    "/my-courses", 
    "/admin", 
    "/instructor",
    "/courses/manage"
  ];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // لو الصفحة محمية ومفيش توكن خالص (لا Access ولا Refresh)، نطرده للـ Login
  if (isProtected && !token && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── صفحات الـ Auth (Login, Register, etc) ──
  // ❌ شيلنا شرط الـ Redirect من هنا عشان نمنع الـ Loop
  // الـ AuthContext هو اللي هيتصرف لو المستخدم مسجل

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