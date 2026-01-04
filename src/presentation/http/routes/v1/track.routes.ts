import { RequestHandler, Router } from "express";

import { TrackController } from "../../controllers/TrackController";
import {
  roleMiddleware,
  uploadLimiter,
  uploadTrackMiddleware,
  validateRequest,
} from "../../middlewares";
import {
  createTrackSchema,
  trackIdSchema,
} from "../../validators/trackValidator";

export function createTrackRoutes(
  controller: TrackController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  // Public routes
  router.get(
    "/:id",
    validateRequest(trackIdSchema),
    controller.getById.bind(controller)
  );

  // Protected routes (Artist only)
  router.use(authMiddleware);
  router.use(roleMiddleware("ARTIST", "ADMIN"));

  // Create track
  router.post(
    "/",
    uploadLimiter,
    uploadTrackMiddleware,
    validateRequest(createTrackSchema),
    controller.create.bind(controller)
  );

  // Publish/Unpublish
  router.patch(
    "/:id/publish",
    validateRequest(trackIdSchema),
    controller.publish.bind(controller)
  );

  router.patch(
    "/:id/unpublish",
    validateRequest(trackIdSchema),
    controller.unpublish.bind(controller)
  );

  // Delete track
  router.delete(
    "/:id",
    validateRequest(trackIdSchema),
    controller.delete.bind(controller)
  );

  return router;
}
