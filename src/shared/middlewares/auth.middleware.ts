import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../errors/app-error";

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, _: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Missing access token");
  }

  const payload = verifyToken(header.split(" ")[1]);

  if (payload.status !== "ACTIVE") {
    throw new AppError(403, "Account is not active");
  }

  req.user = payload;
  next();
};
