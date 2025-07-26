import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get user ID from middleware-injected headers
    const userId = request.headers.get("user_id");
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
      data: { userId },
      message: "Authenticated",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}