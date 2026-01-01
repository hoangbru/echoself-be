import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/errors/';
import { TokenHelper } from '@/shared/utils/tokenHelper';
import { prisma } from '@/config/database.config';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = TokenHelper.verifyToken(token);

    // Get user from database
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
      throw new UnauthorizedError('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your email');
    }

    // Attach user to request
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
      next(new UnauthorizedError('Invalid token'));
    }
  }
};
