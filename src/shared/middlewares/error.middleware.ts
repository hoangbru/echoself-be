import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";
import { AppError } from "../errors/app-error";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(400).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
      },
    });
  }

  // Programming / unknown error
  console.error("Unexpected Error:", err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal Server Error",
    },
  });
}
