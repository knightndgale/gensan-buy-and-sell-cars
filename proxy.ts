import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect seller routes - redirect to login if not authenticated
  if (pathname.startsWith("/seller") && !pathname.startsWith("/seller/login")) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/seller/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller/((?!login).*)", "/admin/:path*"],
};
