import { isAuthenticated } from "@lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const config = {
  matcher: [
    "/api/:path*",     // ✅ Match all API routes for CORS + auth
    "/profile",        // ✅ Your protected page routes
    "/result",
  ],
};

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // 🔧 Get origin from request headers
  const origin = request.headers.get("origin");

  // 🔧 Allowed frontend domains
  const allowedOrigins = [
    "https://prizebond.shounakraj.com",
    "https://prizebondbd.vercel.app",
    "http://localhost:3000"
  ];

  // 🔧 Set correct CORS origin if allowed
  const corsOrigin = allowedOrigins.includes(origin) ? origin : "";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // 🔧 Handle CORS preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // 🔒 Auth logic begins
  const headersList = await headers();
  const tokenFromHeader = headersList.get("authorization");
  const tokenFromCookie = request.cookies.get("token")?.value;

  const token = tokenFromHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : null);
  const user = await isAuthenticated(token);

  if (user && user.id && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: corsHeaders,
    });
  }

  if (!user || !user.id) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ success: false, status: 401, message: "Authentication failed" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return NextResponse.redirect(new URL("/auth/login", request.url), {
      headers: corsHeaders,
    });
  }

  // 🔁 Attach user ID to forwarded request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user_id", user.id);

  const modifiedRequest = new Request(request, {
    headers: requestHeaders,
  });

  return NextResponse.next({
    request: modifiedRequest,
    headers: corsHeaders, // ✅ Apply CORS to success response
  });
}
