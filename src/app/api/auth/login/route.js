import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "@lib/db";
import { cookies } from "next/headers";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

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

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
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

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "150d" });

    cookies().set("token", token, { httpOnly: true, maxAge: 150 * 24 * 60 * 60 });

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