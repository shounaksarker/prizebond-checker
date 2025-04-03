import db from "@lib/db";
import { isAdmin } from "@lib/isAdmin";
import { headers } from "next/headers";

// insert single result into database
export async function GET(request) {
  const headersList = await headers();
  const token = headersList.get("authorization");

  const admin = await isAdmin(token);
  try {
    if (!admin) {
      return Response.json({
        success: false,
        status: 403,
        message: "Unauthorized access",
      });
    }

    const params = request.nextUrl.searchParams;
    
    const draw_id = params.get("draw_id");
    const draw_date = params.get("draw_date");
    const prize_name = params.get("prize_name");
    const prize_amount = params.get("prize_amount");
    const bond_number = params.get("bond_number");

    if (
      !draw_id ||
      !draw_date ||
      !prize_name ||
      !prize_amount ||
      !bond_number
    ) {
      return Response.json({
        success: false,
        status: 400,
        message: "Missing required query parameters",
      });
    }

    // Insert into database
    const query = `
      INSERT INTO prize_draws (draw_id, draw_date, prize_name, prize_amount, bond_number) 
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE prize_amount = VALUES(prize_amount)`;

    await db.query(query, [
      draw_id,
      draw_date,
      prize_name,
      prize_amount,
      bond_number,
    ]);

    return Response.json({
      success: true,
      status: 201,
      message: "Prize result added successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Failed to add prize result",
    });
  }
}

// delete single result
export async function DELETE(request) {
  const headersList = await headers();
const token = headersList.get("authorization");


const admin = await isAdmin(token);
  try {
    if (!admin) {
      return Response.json({
        success: false,
        status: 403,
        message: "Unauthorized access",
      });
    }
    
    const params = request.nextUrl.searchParams;
    const id = params.get("id");
    const bond_number = params.get("bond_number");

    if (!id && !bond_number) {
      return Response.json({
        success: false,
        status: 400,
        message: "Provide either 'id' or 'bond_number' to delete",
      });
    }

    let query;
    let value;

    if (id) {
      query = "DELETE FROM prize_draws WHERE id = ?";
      value = [id];
    } else {
      query = "DELETE FROM prize_draws WHERE bond_number = ?";
      value = [bond_number];
    }

    const [result] = await db.query(query, value);

    if (!result.affectedRows) {
      return Response.json({
        success: false,
        status: 404,
        message: "No matching record found to delete",
      });
    }

    return Response.json({
      success: true,
      status: 200,
      message: "Prize result deleted successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Failed to delete prize result",
    });
  }
}

// insert a draw_result fully (single draw_id's result) into database
export async function POST(request) {
  const headersList = await headers();
const token = headersList.get("authorization");


const admin = await isAdmin(token);
  try {
    if (!admin) {
      return Response.json({
        success: false,
        status: 403,
        message: "Unauthorized access",
      });
    }

    const body = await request.json();

    const { draw_id, date, result } = body;

    if (!draw_id || !date || !result || !Array.isArray(result)) {
      return Response.json({
        success: false,
        status: 400,
        message: "Invalid JSON structure",
      });
    }

    const formattedDate = date.split("/").reverse().join("-");

    const values = [];
    result.forEach(({ name, prize, data }) => {
      if (Array.isArray(data)) {
        data.forEach((prizeNumber) => {
          values.push([
            draw_id,
            formattedDate,
            name,
            parseInt(prize.replace(/,/g, ""), 10),
            prizeNumber,
          ]);
        });
      }
    });

    if (!values.length) {
      return Response.json({
        success: false,
        status: 400,
        message: "No valid prize numbers found",
      });
    }

    const query = `
      INSERT INTO prize_draws (draw_id, draw_date, prize_name, prize_amount, bond_number)
      VALUES ?
      ON DUPLICATE KEY UPDATE prize_amount = VALUES(prize_amount)`;

    await db.query(query, [values]);

    return Response.json({
      success: true,
      status: 201,
      message: `Successfully uploaded ${values.length} prize results for Draw ID ${draw_id}`,
    });
  } catch (error) {
    return Response.json({
      success: false,
      status: 500,
      error: error.message,
      message: "Failed to process JSON file",
    });
  }
}

// insert a lot of draw_id's result into database
// export async function POST(request) {
//   try {
//     if (!admin) {
//       return Response.json({
//         success: false,
//         status: 403,
//         message: "Unauthorized access",
//       });
//     }

//     const body = await request.json();

//     if (!Array.isArray(body) || body.length === 0) {
//       return Response.json({
//         success: false,
//         status: 400,
//         message: "Invalid JSON structure. Expected an array of draws.",
//       });
//     }

//     const values = [];

//     body.forEach(({ draw_id, date, result }) => {
//       if (!draw_id || !date || !Array.isArray(result)) return;

//       const formattedDate = date.split("/").reverse().join("-");

//       result.forEach(({ name, prize, data }) => {
//         if (Array.isArray(data)) {
//           data.forEach((prizeNumber) => {
//             values.push([
//               draw_id,
//               formattedDate,
//               name,
//               parseInt(prize.replace(/,/g, ""), 10),
//               prizeNumber,
//             ]);
//           });
//         }
//       });
//     });

//     if (!values.length) {
//       return Response.json({
//         success: false,
//         status: 400,
//         message: "No valid prize numbers found.",
//       });
//     }

//     const query = `
//       INSERT INTO prize_draws (draw_id, draw_date, prize_name, prize_amount, bond_number)
//       VALUES ?
//       ON DUPLICATE KEY UPDATE prize_amount = VALUES(prize_amount)`;

//     await db.query(query, [values]);

//     return Response.json({
//       success: true,
//       status: 201,
//       message: `Successfully uploaded ${values.length} prize results.`,
//     });
//   } catch (error) {
//     return Response.json({
//       success: false,
//       status: 500,
//       error: error.message,
//       message: "Failed to process request.",
//     });
//   }
// }
