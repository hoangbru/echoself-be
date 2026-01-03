import { RequestHandler, Router } from "express";
import { roleMiddleware } from "../../middlewares";
import { AlbumController } from "../../controllers/AlbumController";

export function createAlbumRoutes(
  controller: AlbumController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Public routes
  router.get("/", controller.getAll.bind(controller));
  router.get("/:id", controller.getById.bind(controller));

  // Protected routes (Artist only)
  router.use(authMiddleware);
  router.use(roleMiddleware("ARTIST", "ADMIN"));

  router.post("/", controller.create.bind(controller));
  router.put("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  return router;
}
