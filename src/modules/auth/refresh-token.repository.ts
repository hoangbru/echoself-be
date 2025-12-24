export interface RefreshTokenRepository {
  create(input: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void>;

  findValid(token: string): Promise<{
    id: string;
    userId: string;
    revoked: boolean;
    expiresAt: Date;
  } | null>;

  revoke(token: string): Promise<void>;
  revokeAllByUser(userId: string): Promise<void>;
}
