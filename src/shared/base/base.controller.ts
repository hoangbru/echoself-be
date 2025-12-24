import { Request, Response, NextFunction } from "express";

export abstract class BaseController {
  protected asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

  protected ok<T>(res: Response, data: T) {
    return res.status(200).json({
      success: true,
      data,
    });
  }

  protected created<T>(res: Response, data: T) {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  protected noContent(res: Response) {
    return res.status(204).send();
  }
}
