import { User } from "@prisma/client";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  create(data: {
    userName: string;
    email: string;
    passwordHash: string;
    displayName?: string;
  }): Promise<User>;
}
