import { AppError } from "@/shared/errors/app-error";

export const authorize =
  (...roles: Array<"ADMIN" | "USER">) =>
  (req: any, _: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }
    next();
  };
