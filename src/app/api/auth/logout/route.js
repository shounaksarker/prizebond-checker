import { cookies } from "next/headers";

export async function POST() {
 try {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return Response.json({
    success: true,
    status: 200,
    message: "Logout successful",
  });
 } catch (error) {
  return Response.json({
    success: false,
    status: 500,
    error: error.message,
    message: "Logout failed",
  });
 }
}
