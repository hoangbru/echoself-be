import { User } from "../entities/User";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
  setVerificationToken(userId: string, token: string): Promise<void>;
  findByVerificationToken(token: string): Promise<User | null>;
  setResetPasswordToken(
    userId: string,
    token: string,
    expires: Date
  ): Promise<void>;
  findByResetPasswordToken(token: string): Promise<User | null>;
  updateLastLogin(userId: string): Promise<void>;
}
