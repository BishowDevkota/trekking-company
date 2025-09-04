import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_SECRET and REFRESH_SECRET must be set in .env");
}

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); // short-lived
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // long-lived
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
