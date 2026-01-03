import { ITokenBlacklistService } from "@/application/interfaces/ITokenBlacklistService";
import { logger } from "@/shared/utils/logger";

// For development without Redis
export class InMemoryTokenBlacklistService implements ITokenBlacklistService {
  private blacklist: Set<string> = new Set();
  private expirations: Map<string, NodeJS.Timeout> = new Map();

  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    this.blacklist.add(token);
    logger.info(`Token blacklisted (in-memory): ${token.substring(0, 20)}...`);

    // Auto-remove after expiration
    const timeout = setTimeout(() => {
      this.blacklist.delete(token);
      this.expirations.delete(token);
    }, expiresIn * 1000);

    this.expirations.set(token, timeout);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklist.has(token);
  }
}
