import { RequestHandler, Router } from "express";
import { PlaylistController } from "../../controllers/PlaylistController";

export function createPlaylistRoutes(
  controller: PlaylistController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Public routes
  router.get("/public", controller.getPublicPlaylists.bind(controller));
  router.get("/:id", controller.getById.bind(controller));

  // Protected routes
  router.use(authMiddleware);

  router.get("/", controller.getUserPlaylists.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));
  router.post("/:id/tracks", controller.addTrack.bind(controller));
  router.delete(
    "/:id/tracks/:trackId",
    controller.removeTrack.bind(controller)
  );

  return router;
}
