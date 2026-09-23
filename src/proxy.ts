import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "bbp_admin_session";

/**
 * Optimistic gate for /admin/*: only checks the session cookie is present.
 * The cookie's HMAC signature and expiry are verified for real in
 * `getSession()` (src/lib/auth.ts), used by the admin layout and every
 * admin server action — this proxy just avoids flashing protected UI.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
