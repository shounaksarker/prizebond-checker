import db from "@lib/db";
import { headers } from "next/headers";

export async function GET(_) {
  try {
    const headersList = await headers();
    const user_id = headersList.get("user_id");

    if (!user_id) {
      return Response.json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    // Fetch all prize bonds for the user
    const query = "SELECT id, name, email, mobile FROM users WHERE id = ?";
    const [user] = await db.query(query, [user_id]);

    return Response.json({
      success: true,
      status: 200,
      data: user.length ? user[0] : null,
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
}

export async function PUT(req) {
  try {
    const headersList = await headers();
    const user_id = headersList.get("user_id");

    if (!user_id) {
      return Response.json({
        success: false,
        status: 401,
        message: "Unauthorized",
      });
    }

    const { name, email, mobile } = await req.json();

    // Update user profile
    const query =
      "UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?";
    const [result] = await db.query(query, [name, email, mobile, user_id]);

    if (!result.affectedRows) {
      return Response.json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    return Response.json({
      success: true,
      status: 200,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
}