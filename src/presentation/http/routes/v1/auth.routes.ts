import { RequestHandler, Router } from "express";

import { authLimiter } from "../../middlewares";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../../validators/authValidator";
import { AuthController } from "../../controllers/AuthController";

export function createAuthRoutes(
  controller: AuthController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Apply rate limiting to auth routes
  router.use(authLimiter);

  // Public routes
  router.post(
    "/register",
    validateRequest(registerSchema),
    controller.register.bind(controller)
  );

  router.post(
    "/login",
    validateRequest(loginSchema),
    controller.login.bind(controller)
  );

  router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    controller.refresh.bind(controller)
  );

  router.post(
    "/verify-email",
    validateRequest(verifyEmailSchema),
    controller.verifyEmail.bind(controller)
  );

  router.post(
    "/forgot-password",
    validateRequest(forgotPasswordSchema),
    controller.forgotPassword.bind(controller)
  );

  router.post(
    "/reset-password",
    validateRequest(resetPasswordSchema),
    controller.resetPassword.bind(controller)
  );

  // Protected routes
  router.post("/logout", authMiddleware, controller.logout.bind(controller));

  router.post(
    "/change-password",
    authMiddleware,
    validateRequest(changePasswordSchema),
    controller.changePassword.bind(controller)
  );

  return router;
}
