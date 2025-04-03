import bcrypt from "bcrypt";
import db from "@lib/db";
import dotenv from "dotenv";

dotenv.config();

// **User Signup**
export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

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
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length) {
      return Response.json({
        success: false,
        status: 400,
        error: "User already exists",
        message: "Duplicate email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return Response.json({
      success: true,
      status: 201,
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
