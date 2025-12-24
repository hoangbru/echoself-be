import { Status } from "@prisma/client";
import { AppError } from "@/shared/errors/app-error";
import { AuthService } from "./auth.service";
import { UserRepository } from "../user/user.repository";

export class AuthUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService
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
      throw new AppError(409, "Email already in use");
    }

    if (userNameExists) {
      throw new AppError(409, "Username already in use");
    }

    const passwordHash = await this.authService.hash(input.password);

    const user = await this.userRepo.create({
      userName: input.userName,
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    });

    return {
      token: this.authService.generateToken(user),
      user: this.toPublicUser(user),
    };
  }

  async login(input: { identifier: string; password: string }) {
    const user = input.identifier.includes("@")
  ? await this.userRepo.findByEmail(input.identifier)
  : await this.userRepo.findByUserName(input.identifier);

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    if (user.status !== Status.ACTIVE) {
      throw new AppError(403, "Account is not active");
    }

    const isValid = await this.authService.compare(
      input.password,
      user.passwordHash
    );

    if (!isValid) {
      throw new AppError(401, "Invalid credentials");
    }

    return {
      token: this.authService.generateToken(user),
      user: this.toPublicUser(user),
    };
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
