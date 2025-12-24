import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/prisma.client";
import { RefreshTokenRepository } from "@/modules/auth/refresh-token.repository";

export class PrismaRefreshTokenRepository
  implements RefreshTokenRepository
{
  constructor(private readonly prisma: PrismaClient) {}
  
  async create(input: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    await this.prisma.refreshToken.create({ data: input });
  }

  findValid(token: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        token,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async revoke(token: string) {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAllByUser(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}
