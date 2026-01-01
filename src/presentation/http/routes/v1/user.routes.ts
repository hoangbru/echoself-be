import { Router } from "express";
import { UserController } from "../../controllers/UserController";
import { authMiddleware } from "../../middlewares";

export function createUserRoutes(controller: UserController): Router {
  const router = Router();

  // Public routes
  router.get("/:id", controller.getById.bind(controller));

  // Protected routes
  router.use(authMiddleware);
  router.get("/me", controller.getProfile.bind(controller));
  router.put("/me", controller.updateProfile.bind(controller));

  return router;
}
