import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from 'types';
import { verifyAccessToken } from 'utils/jwt.utils';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const messages = error.details.map((detail: any) => detail.message)
      res.status(400).json({ errors: messages })
      return
    }

    req.body = value
    next()
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin role required." })
  }
  next()
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error: any) {
    return res.status(401).json({ error: error.message })
  }
}
