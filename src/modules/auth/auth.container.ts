import { prisma } from "@/infrastructure/prisma/prisma.client";

import { AuthController } from "./auth.controller";
import { AuthUseCase } from "./auth.usecase";
import { AuthService } from "./auth.service";
import { PrismaUserRepository } from "@/infrastructure/prisma/user.repository.impl";

const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService();
const authUseCase = new AuthUseCase(userRepository, authService);

export const authController = new AuthController(authUseCase);
