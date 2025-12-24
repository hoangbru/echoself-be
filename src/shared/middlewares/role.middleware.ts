import { ForbiddenError } from "../errors/http-errors";

export const authorize =
  (...roles: Array<"ADMIN" | "USER">) =>
  (req: any, _: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError("Forbidden");
    }
    next();
  };
