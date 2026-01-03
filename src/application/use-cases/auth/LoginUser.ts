import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { PasswordHelper } from "@/shared/utils/passwordHelper";
import { TokenHelper } from "@/shared/utils/tokenHelper";
import { UnauthorizedError } from "@/shared/errors";

export interface LoginUserInput {
  identifier: string;
  password: string;
}

export interface LoginUserOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    role: string;
    avatar?: string;
  };
}

export class LoginUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const isEmail = this.isEmail(input.identifier);

    const user = isEmail
      ? await this.userRepository.findByEmail(input.identifier)
      : await this.userRepository.findByUsername(input.identifier);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new UnauthorizedError("Please verify your email before logging in");
    }

    const isPasswordValid = await PasswordHelper.compare(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    await this.userRepository.updateLastLogin(user.id);

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = TokenHelper.generateAccessToken(payload);
    const refreshToken = TokenHelper.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  private isEmail(identifier: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
  }
}
