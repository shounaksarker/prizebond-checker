import { isAuthenticated } from "@lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const config = {
  matcher: [
    "/api/draw",
    "/api/user",
    "/api/user/prize-bond",
    "/profile",
    "/result",
    // "/auth/login",
    // "/auth/signup",
  ],
};

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const headersList = await headers();
  const tokenFromHeader = headersList.get("authorization");
  const tokenFromCookie = request.cookies.get("token")?.value;
  // Prefer Authorization header if present (for API), else fallback to cookie (for pages)
  const token = tokenFromHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : null);

  const user = await isAuthenticated(token);

  if(user && user.id && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user || !user.id) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { success: false, status: 401, message: "Authentication failed" },
        { status: 401 }
      );
    }

    // For page routes: redirect to home or login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Attach user ID to request headers (API enhancement)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user_id", user.id);

  const modifiedRequest = new Request(request, { headers: requestHeaders });

  return NextResponse.next({
    request: modifiedRequest,
  });
}
