import { hashPassword, comparePassword } from "@/shared/utils/password";
import { signToken } from "@/shared/utils/jwt";

export class AuthService {
  async hash(password: string) {
    return hashPassword(password);
  }

  async compare(password: string, hash: string) {
    return comparePassword(password, hash);
  }

  generateToken(user: any) {
    return signToken({
      userId: user.id,
      role: user.role,
      status: user.status,
    });
  }
  
}
