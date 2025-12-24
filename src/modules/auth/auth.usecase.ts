import { Status } from "@prisma/client";
import { AppError } from "@/shared/errors/app-error";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";
import { PrismaRefreshTokenRepository } from "@/infrastructure/prisma/refresh-token.repository.impl";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/shared/utils/jwt";

export class AuthUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly refreshTokenRepo: PrismaRefreshTokenRepository
  ) {}

  async register(input: {
    userName: string;
    email: string;
    password: string;
    displayName?: string;
  }) {
    const [emailExists, userNameExists] = await Promise.all([
      this.userRepo.findByEmail(input.email),
      this.userRepo.findByUserName(input.userName),
    ]);

    if (emailExists) {
      throw new AppError("EMAIL_ALREADY_EXISTS", "Email already in use");
    }

    if (userNameExists) {
      throw new AppError("USERNAME_ALREADY_EXISTS", "Username already in use");
    }

    const passwordHash = await this.authService.hash(input.password);

    const user = await this.userRepo.create({
      userName: input.userName,
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    });

    return {
      token: this.authService.generateAccessToken(user),
      user: this.toPublicUser(user),
    };
  }

  async login(input: { identifier: string; password: string }) {
    const user = input.identifier.includes("@")
      ? await this.userRepo.findByEmail(input.identifier)
      : await this.userRepo.findByUserName(input.identifier);

    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", "Invalid credentials");
    }

    if (user.status !== Status.ACTIVE) {
      throw new AppError("ACCOUNT_NOT_ACTIVE", "Account is not active");
    }

    const isValid = await this.authService.compare(
      input.password,
      user.passwordHash
    );

    if (!isValid) {
      throw new AppError("INVALID_CREDENTIALS", "Invalid credentials");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ userId: user.id });

    await this.refreshTokenRepo.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const stored = await this.refreshTokenRepo.findValid(refreshToken);
    if (!stored) throw new Error("Refresh token invalid");

    await this.refreshTokenRepo.revoke(refreshToken);

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: "USER",
    });

    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
    });

    await this.refreshTokenRepo.create({
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenRepo.revoke(refreshToken);
  }

  async logoutAll(userId: string) {
    await this.refreshTokenRepo.revokeAllByUser(userId);
  }

  private toPublicUser(user: any) {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      displayName: user.displayName,
      avatarUri: user.avatarUri,
      role: user.role,
      isPremium: user.isPremium,
      premiumUntil: user.premiumUntil,
    };
  }
}
