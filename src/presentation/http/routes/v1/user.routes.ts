import { RequestHandler, Router } from "express";
import { UserController } from "../../controllers/UserController";

export function createUserRoutes(
  controller: UserController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Public routes
  router.get("/me", authMiddleware, controller.getProfile.bind(controller));
  router.put("/me", authMiddleware, controller.updateProfile.bind(controller));
  router.get("/:id", controller.getById.bind(controller));

  return router;
}
