import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(
        new HttpError(400, "Validation failed", {
          issues: result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        })
      );
    }

    next();
  };
