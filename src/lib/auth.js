import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = async (user) => {
  const secretKey = new TextEncoder().encode(SECRET_KEY);

  const token = await new SignJWT({ id: user.id, email: user.email, admin: user.admin })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("150d")
    .sign(secretKey);

  return token;
};


const isAuthenticated = async (token) => {
  const secretKey = new TextEncoder().encode(SECRET_KEY);

  if (!token || !token.startsWith("Bearer ")) {
    return { error: "Unauthorized: No token provided" };
  }

  // Extract token (remove 'Bearer ')
  const jwt = token.split(" ")[1];

  try {
    const { payload } = await jwtVerify(jwt, secretKey);
    return payload;
  } catch (error) {
    return { error: "Unauthorized: Invalid token" };
  }
};


export { generateToken, isAuthenticated };
