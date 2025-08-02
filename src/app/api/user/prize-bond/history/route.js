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
    const query = `
      SELECT h.bond_number, h.prize_name, h.prize_amount, h.draw_date, h.draw_id
      FROM user_winning_history h
      INNER JOIN user_prize_bonds b ON h.user_id = b.user_id AND h.bond_number = b.bond_number
      WHERE h.user_id = ? AND b.is_claimed = 1
      ORDER BY h.draw_date DESC
    `;
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

// Claim a bond (set is_claimed=1)
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
    const { bond_number } = await request.json();
    if (!bond_number) {
      return Response.json({
        success: false,
        status: 400,
        message: "Bond number is required",
      });
    }
    const query = `UPDATE user_prize_bonds SET is_claimed = 1 WHERE user_id = ? AND bond_number = ?`;
    const [result] = await db.query(query, [user_id, bond_number]);
    if (result.affectedRows === 0) {
      return Response.json({
        success: false,
        status: 404,
        message: "Bond not found or already claimed",
      });
    }
    return Response.json({
      success: true,
      status: 200,
      message: "Bond claimed successfully",
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
