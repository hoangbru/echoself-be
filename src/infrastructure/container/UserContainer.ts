import { RegisterUser } from "@/application/use-cases/user/RegisterUser";
import { GetUserById } from "@/application/use-cases/user/GetUserById";
import { UpdateUserProfile } from "@/application/use-cases/user/UpdateUserProfile";
import { UserController } from "@/presentation/http/controllers/UserController";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "../database/repositories/PrismaUserRepository";

export class UserContainer {
  public readonly controller: UserController;

  constructor(prisma: PrismaClient) {
    const repo = new PrismaUserRepository(prisma);

    this.controller = new UserController(
      new RegisterUser(repo),
      new GetUserById(repo),
      new UpdateUserProfile(repo)
    );
  }
}
