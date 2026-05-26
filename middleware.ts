import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/auth-cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  const isLogin = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isPartnerRoute = pathname.startsWith("/partner");
  const isProtected = isAdminRoute || isPartnerRoute;

  if (!token && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isLogin) {
    const destination =
      role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (token && isAdminRoute && role === "partner") {
    return NextResponse.redirect(new URL("/partner/dashboard", request.url));
  }

  if (token && isPartnerRoute && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (token && pathname === "/") {
    const destination =
      role === "admin" ? "/admin/dashboard" : "/partner/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/partner/:path*"],
};
