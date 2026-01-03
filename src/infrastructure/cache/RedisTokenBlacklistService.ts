import { createClient, RedisClientType } from "redis";

import { ITokenBlacklistService } from "@/application/interfaces";
import { logger } from "@/shared/utils/logger";

export class RedisTokenBlacklistService implements ITokenBlacklistService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    this.client.connect().then(() => {
      logger.info("Redis connected for token blacklist");
    });
  }

  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.client.set(key, "1", {
      EX: expiresIn, // Expire after token expiration time
    });
    logger.info(`Token blacklisted: ${token.substring(0, 20)}...`);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.client.get(key);
    return result !== null;
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
}
