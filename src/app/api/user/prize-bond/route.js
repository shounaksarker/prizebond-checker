import db from "@lib/db";
import { headers } from "next/headers";

// user create prizebonds
export async function POST(request) {
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

    const { prizebonds } = await request.json();

    if (!prizebonds || !Array.isArray(prizebonds) || !prizebonds.length) {
      return Response.json({
        success: false,
        status: 400,
        message: "Invalid prize bond data",
      });
    }

    const values = prizebonds.map((number) => [user_id, number]);

    // Insert into DB
    const query = "INSERT INTO user_prize_bonds (user_id, bond_number) VALUES ?";
    await db.query(query, [values]);

    return Response.json({
      success: true,
      status: 201,
      message: "Prize bonds added successfully",
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

// user edit prizebond
export async function PATCH(request) {
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

    // Parse the request body
    const { id, bond_number } = await request.json();

    if (!id|| !bond_number) {
      return Response.json({
        success: false,
        status: 400,
        message: "Both id and new prize bond number are required",
      });
    }

    const query = `
      UPDATE user_prize_bonds 
      SET bond_number = ? 
      WHERE user_id = ? AND id = ?
    `;
    const [result] = await db.query(query, [bond_number, user_id, id]);

    if (result.affectedRows === 0) {
      return Response.json({
        success: false,
        status: 404,
        message: "Prize bond not found or no changes made",
      });
    }

    return Response.json({
      success: true,
      status: 200,
      message: "Prize bond updated successfully",
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

// user all prizebonds
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
    const query = "SELECT id, bond_number FROM user_prize_bonds WHERE user_id = ?";
    const [rows] = await db.query(query, [user_id]);

    return Response.json({
      success: true,
      status: 200,
      data: rows,
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
// user delete prizebond
export async function DELETE(request) {
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

    const { id } = await request.json();

    // Validate input
    if (!id) {
      return Response.json({
        success: false,
        status: 400,
        message: "ID is required",
      });
    }

    // Delete the prize bond
    const query = `
      DELETE FROM user_prize_bonds 
      WHERE user_id = ? AND id = ?
    `;
    const [result] = await db.query(query, [user_id, id]);

    if (result.affectedRows === 0) {
      return Response.json({
        success: false,
        status: 404,
        message: "Prize bond not found",
      });
    }

    return Response.json({
      success: true,
      status: 200,
      message: "Prize bond deleted successfully",
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

