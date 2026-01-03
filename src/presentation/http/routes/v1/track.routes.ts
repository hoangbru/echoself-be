import { RequestHandler, Router } from "express";

import { TrackController } from "../../controllers/TrackController";
import { uploadTrackMiddleware, validateRequest } from "../../middlewares";
import { uploadTrackSchema } from "../../validators/trackValidator";

export function createTrackRoutes(
  trackController: TrackController,
  authMiddleware: RequestHandler
): Router {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    uploadTrackMiddleware,
    validateRequest(uploadTrackSchema),
    (req, res, next) => trackController.upload(req, res, next)
  );

  return router;
}
