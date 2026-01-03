import { PrismaClient } from "@prisma/client";

import { UserController } from "@/presentation/http/controllers/UserController";
import { PrismaUserRepository } from "../database/repositories/PrismaUserRepository";
import { GetUserById, UpdateUserProfile } from "@/application/use-cases/user";

export class UserContainer {
  public readonly controller: UserController;

  constructor(prisma: PrismaClient) {
    const userRepository = new PrismaUserRepository(prisma);

    this.controller = new UserController(
      new GetUserById(userRepository),
      new UpdateUserProfile(userRepository)
    );
  }
}
