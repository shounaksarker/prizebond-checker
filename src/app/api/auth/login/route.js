import bcrypt from "bcrypt";
import db from "@lib/db";
import { cookies } from "next/headers";
import dotenv from "dotenv";
import { generateToken } from "@lib/auth";

dotenv.config();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({
        success: false,
        status: 400,
        error: "Email and password are required",
        message: "Validation failed",
      });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!users.length) {
      return Response.json({
        success: false,
        status: 401,
        error: "Invalid email",
        message: "Login failed",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({
        success: false,
        status: 401,
        error: "Invalid password",
        message: "Login failed",
      });
    }

    delete user.password;
    const token = await generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true, maxAge: 150 * 24 * 60 * 60 });

    return Response.json({
      success: true,
      status: 200,
      data: { token },
      message: "Login successful",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Server error",
    });
  }
}