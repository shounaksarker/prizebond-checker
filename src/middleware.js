import { isAuthenticated } from "@lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const config = {
  matcher: ["/api/draw", "/api/user/prize-bond"],
};

export async function middleware(request) {
  const headersList = await headers();
  const token = headersList.get("authorization");
  const user = await isAuthenticated(token);

  if (!user || !user.id) {
    return NextResponse.json(
      { success: false, status: 401, message: "Authentication failed" },
      { status: 401 }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user_id", user.id);

  const modifiedRequest = new Request(request, { headers: requestHeaders });

  return NextResponse.next({
    request: modifiedRequest,
  });
}
