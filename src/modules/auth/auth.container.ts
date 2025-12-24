import { PrismaRefreshTokenRepository } from "@/infrastructure/prisma/refresh-token.repository.impl";
import { PrismaUserRepository } from "@/infrastructure/prisma/user.repository.impl";
import { AuthUseCase } from "./auth.usecase";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { prisma } from "@/infrastructure/prisma/prisma.client";

const userRepo = new PrismaUserRepository(prisma);
const refreshTokenRepo = new PrismaRefreshTokenRepository(prisma);
const authService = new AuthService();

const authUseCase = new AuthUseCase(userRepo, authService, refreshTokenRepo);

export const authController = new AuthController(authUseCase);
