import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ValidationError } from '@/shared/errors/';

export const validateRequest = (schema: ZodObject<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(
          (err) => `${err.path.join('.')}: ${err.message}`,
        );
        next(new ValidationError(messages.join(', ')));
      } else {
        next(error);
      }
    }
  };
};
