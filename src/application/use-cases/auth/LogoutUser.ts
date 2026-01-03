import jwt from "jsonwebtoken";
import { ITokenBlacklistService } from "@/application/interfaces";

export interface LogoutUserInput {
  token: string;
}

export class LogoutUser {
  constructor(private readonly tokenBlacklistService: ITokenBlacklistService) {}

  async execute(input: LogoutUserInput): Promise<void> {
    const decoded = jwt.decode(input.token) as any;

    if (!decoded || !decoded.exp) {
      return;
    }

    // Calculate remaining time until expiration
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - currentTime;

    if (expiresIn > 0) {
      await this.tokenBlacklistService.blacklistToken(input.token, expiresIn);
    }
  }
}
