export interface ITokenBlacklistService {
  blacklistToken(token: string, expiresIn: number): Promise<void>;
  isTokenBlacklisted(token: string): Promise<boolean>;
}
