import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";
import { HttpError } from "./http-error";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known HTTP Error
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        details: err.details ?? null,
      },
    });
  }

  // Known Domain Error (fallback)
  if (err instanceof AppError) {
    return res.status(400).json({
      error: {
        message: err.message,
      },
    });
  }

  // Unknown / Programming Error
  console.error("Unexpected Error:", err);

  return res.status(500).json({
    error: {
      message: "Internal Server Error",
    },
  });
}
