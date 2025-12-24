import crypto from "crypto";
import { User } from "@prisma/client";
import { hashPassword, comparePassword } from "@/shared/utils/password";
import { signAccessToken } from "@/shared/utils/jwt";

export class AuthService {
  async hash(password: string) {
    return hashPassword(password);
  }

  async compare(password: string, hash: string) {
    return comparePassword(password, hash);
  }

  generateAccessToken(user: User) {
    return signAccessToken({
      userId: user.id,
      role: user.role,
    });
  }

  generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }
}
