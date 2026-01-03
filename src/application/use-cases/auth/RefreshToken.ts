import { TokenHelper } from '@/shared/utils/tokenHelper';
import { UnauthorizedError } from '@/shared/errors';

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshToken {
  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    try {
      const decoded = TokenHelper.verifyToken(input.refreshToken);

      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      const accessToken = TokenHelper.generateAccessToken(payload);
      const refreshToken = TokenHelper.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}