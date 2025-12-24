import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http-error";

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth =
  (roles?: Array<JwtPayload["role"]>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing authorization token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (roles && !roles.includes(payload.role)) {
        throw new HttpError(403, "Forbidden");
      }

      req.user = payload;
      next();
    } catch {
      throw new HttpError(401, "Invalid or expired token");
    }
  };
