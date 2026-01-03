import { PrismaClient } from "@prisma/client";

import {
  ChangePassword,
  ForgotPassword,
  LoginUser,
  LogoutUser,
  RefreshToken,
  RegisterUser,
  ResetPassword,
  VerifyEmail,
} from "@/application/use-cases/auth";
import {
  IEmailService,
  ITokenBlacklistService,
} from "@/application/interfaces";
import { PrismaAuthRepository } from "../database/repositories/PrismaAuthRepository";
import { AuthController } from "@/presentation/http/controllers/AuthController";

export class AuthContainer {
  public readonly controller: AuthController;

  constructor(
    prisma: PrismaClient,
    emailService: IEmailService,
    tokenBlacklistService: ITokenBlacklistService
  ) {
    const authRepository = new PrismaAuthRepository(prisma);

    this.controller = new AuthController(
      new RegisterUser(authRepository, emailService),
      new LoginUser(authRepository),
      new RefreshToken(),
      new LogoutUser(tokenBlacklistService),
      new VerifyEmail(authRepository, emailService),
      new ForgotPassword(authRepository, emailService),
      new ResetPassword(authRepository, emailService),
      new ChangePassword(authRepository, emailService)
    );
  }
}
