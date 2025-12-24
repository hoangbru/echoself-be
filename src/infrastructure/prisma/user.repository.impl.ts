import { PrismaClient } from "@prisma/client";
import { UserRepository } from "@/modules/user/user.repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUserName(userName: string) {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  create(data: any) {
    return this.prisma.user.create({ data });
  }
}
