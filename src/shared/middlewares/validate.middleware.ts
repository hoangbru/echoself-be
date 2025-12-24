import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new HttpError(400, "Validation failed", {
          issues: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(err);
    }
  };
