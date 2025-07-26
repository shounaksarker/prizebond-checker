import db from "@lib/db";

export async function GET(request) {
  try {
    const headersList = request.headers;
    const user_id = headersList.get("user_id");

    if (!user_id) {
      return Response.json({
        success: false,
        status: 401,
        message: "Unauthorized: Token is required",
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const draw_id = searchParams.get("draw_id");

    if (!draw_id) {
      return Response.json({
        success: false,
        status: 400,
        message: "draw_id is required",
      });
    }

    // Query to check if user's numbers have won
    const query = `
      SELECT 
        p.bond_number, 
        p.prize_amount, 
        p.draw_id, 
        p.draw_date, 
        p.prize_name
      FROM prize_draws p
      INNER JOIN user_prize_bonds u ON p.bond_number = u.bond_number
      WHERE u.user_id = ? AND p.draw_id = ?`;

    const [results] = await db.query(query, [user_id, draw_id]);

    const matched_length = results.length;

    if (matched_length) {
      const insertQuery = `
        INSERT INTO user_winning_history (user_id, draw_id, bond_number, prize_amount, prize_name, draw_date)
        VALUES ?
      `;
      const values = results.map((result) => [
        user_id,
        result.draw_id,
        result.bond_number,
        result.prize_amount,
        result.prize_name,
        result.draw_date,
      ]);

      const checkQuery = `
        SELECT * FROM user_winning_history 
        WHERE user_id = ? AND bond_number = ?
      `;
      const checkValues = results.map((result) => [
        user_id,
        result.bond_number,
      ]);
      const checkResults = await Promise.all(
        checkValues.map((value) => db.query(checkQuery, value))
      );
      const filteredValues = values.filter((_, index) => {
        const checkResult = checkResults[index][0];
        return !checkResult.length;
      });
      if (filteredValues.length) {
        const insertQuery = `
          INSERT INTO user_winning_history (user_id, draw_id, bond_number, prize_amount, prize_name, draw_date)
          VALUES ?
        `;
        await db.query(insertQuery, [filteredValues]);
      }
    }

    return Response.json({
      success: true,
      status: 200,
      data: matched_length ? results : [],
      message: matched_length
        ? `${matched_length} bond matched`
        : "No matching results",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Failed to fetch prize draw results",
    });
  }
}

// get lower and upper draw_id
export async function POST(request) {
  try {
    // This is a public endpoint - no authentication required
    const query = `
      SELECT 
        MIN(draw_id) AS first_draw, 
        MAX(draw_id) AS last_draw
      FROM prize_draws`;

    const [results] = await db.query(query);

    return Response.json({
      success: true,
      status: 200,
      data: results.length ? results[0] : null,
      message: "Draw range fetched successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Failed to fetch prize draw results",
    });
  }
}
