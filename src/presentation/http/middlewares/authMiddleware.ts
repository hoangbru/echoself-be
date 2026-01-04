import { Request, Response, NextFunction } from "express";

import { UnauthorizedError } from "@/shared/errors/";
import { TokenHelper } from "@/shared/utils/tokenHelper";
import { prisma } from "@/config/database.config";
import { ITokenBlacklistService } from "@/application/interfaces";

export const createAuthMiddleware = (
  tokenBlacklistService: ITokenBlacklistService
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
      }

      const token = authHeader.substring(7);

      // Check if token is blacklisted
      if (tokenBlacklistService) {
        const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(
          token
        );
        if (isBlacklisted) {
          throw new UnauthorizedError("Token has been revoked");
        }
      }

      const decoded = TokenHelper.verifyToken(token);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          artists: {
            select: { id: true },
            take: 1,
          },
        },
      });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      if (!user.isVerified) {
        throw new UnauthorizedError("Please verify your email");
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        artistId: user.artists[0]?.id,
      };

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        next(error);
      } else {
        next(new UnauthorizedError("Invalid token"));
      }
    }
  };
};
