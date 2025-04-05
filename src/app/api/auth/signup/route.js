import bcrypt from "bcrypt";
import db from "@lib/db";
import dotenv from "dotenv";

dotenv.config();

// **User Signup**
export async function POST(request) {
  try {
    const { name, email, password, mobile = null } = await request.json();

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, mobile]);

    return Response.json({
      success: true,
      status: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log('📛 👉 ~ POST ~ error:', error);
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Server error",
    });
  }
}
