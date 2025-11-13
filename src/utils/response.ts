import { Response } from "express";

export const apiResponse = (
  res: Response,
  data: unknown = {},
  message: string | null = null,
  meta: unknown = null,
  links: unknown = null,
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
    ...(links ? { links } : {}),
  });
};
