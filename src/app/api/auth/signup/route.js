import bcrypt from "bcrypt";
import db from "@lib/db";
import { cookies } from "next/headers";
import dotenv from "dotenv";
import { generateToken } from "@lib/auth";

dotenv.config();

// **User Signup**
export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      mobile = null,
      google_user = 0,
    } = await request.json();

    if (!name || !email || !password) {
      return Response.json({
        success: false,
        status: 400,
        error: "All fields are required",
        data: null,
        message: "Validation failed",
      });
    }

    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length) {
      return Response.json({
        success: false,
        status: 400,
        error: "User already exists",
        message: "Duplicate email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [feedback] = await db.query(
      "INSERT INTO users (name, email, password, mobile, google_user) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, mobile, google_user]
    );
    const token = await generateToken({
      id: feedback.insertId,
      name,
      email,
      mobile,
      google_user,
    });
    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 });

    return Response.json({
      success: true,
      status: 201,
      data: { token },
      message: "User registered successfully",
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
