import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "HeyItsAaryanTheDeveloper@2002--aaryanpandey.com";
  if (!process.env.JWT_SECRET) {
    console.warn(
      "JWT_SECRET is not set in environment variables. Using default secret.",
    );
  }
  return new TextEncoder().encode(secret);
};

export async function signJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecretKey());
}

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
