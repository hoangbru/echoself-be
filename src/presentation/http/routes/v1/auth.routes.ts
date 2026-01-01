import { Router } from "express";

import { AppContainer } from "@/infrastructure/container/AppContainer";
import { authLimiter } from "../../middlewares";

export function createAuthRoutes(container: AppContainer): Router {
  const router = Router();

  // Apply rate limiting to auth routes
  router.use(authLimiter);

  // Auth endpoints would use AuthController
  // router.post('/register', authController.register);
  // router.post('/login', authController.login);
  // router.post('/refresh', authController.refreshToken);
  // router.post('/logout', authMiddleware, authController.logout);
  // router.post('/verify-email', authController.verifyEmail);
  // router.post('/forgot-password', authController.forgotPassword);
  // router.post('/reset-password', authController.resetPassword);

  return router;
}
