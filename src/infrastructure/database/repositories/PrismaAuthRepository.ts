import { PrismaClient } from "@prisma/client";
import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";

export class PrismaAuthRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role as any,
        isVerified: user.isVerified,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user ? this.toDomain(user) : null;
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async updateVerificationStatus(
    userId: string,
    isVerified: boolean
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });
  }

  async setVerificationToken(userId: string, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    return user ? this.toDomain(user) : null;
  }

  async setResetPasswordToken(
    userId: string,
    token: string,
    expires: Date
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    return user ? this.toDomain(user) : null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  private toDomain(user: any): User {
    return new User(
      user.id,
      user.email,
      user.username,
      user.password,
      user.displayName,
      user.avatar,
      user.bio,
      user.role,
      user.isVerified,
      user.createdAt,
      user.updatedAt
    );
  }
}
