import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenHelper {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "your-secret-key";
  private static readonly JWT_EXPIRES_IN = "7d";
  private static readonly REFRESH_TOKEN_EXPIRES_IN = "30d";

  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
  }

  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  static generateVerificationToken(): string {
    return this.generateRandomToken(32);
  }

  static generateResetPasswordToken(): string {
    return this.generateRandomToken(32);
  }
}
