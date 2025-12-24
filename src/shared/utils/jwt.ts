import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET) as JwtPayload;
