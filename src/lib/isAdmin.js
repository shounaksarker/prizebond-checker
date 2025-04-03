import { isAuthenticated } from "@lib/auth";


export async function isAdmin(token) {

  if (!token) {
    return false;
  }

  const user = await isAuthenticated(token);

  if (!user || !user.admin) {
   return false;
  }

  return true;
}