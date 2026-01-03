import { Router } from "express";

import { AppContainer } from "@/infrastructure/container/AppContainer";

import { createAuthRoutes } from "./auth.routes";
import { createUserRoutes } from "./user.routes";
import { createTrackRoutes } from "./track.routes";
import { createAlbumRoutes } from "./album.routes";
import { createPlaylistRoutes } from "./playlist.routes";
import { createAuthMiddleware } from "../../middlewares";

export function createV1Routes(container: AppContainer): Router {
  const router = Router();
  const tokenBlacklistService =
    container.serviceContainer.tokenBlacklistService;

  const authMiddleware = createAuthMiddleware(tokenBlacklistService);

  router.use(
    "/auth",
    createAuthRoutes(container.auth.controller, authMiddleware)
  );
  router.use(
    "/users",
    createUserRoutes(container.user.controller, authMiddleware)
  );
  router.use(
    "/tracks",
    createTrackRoutes(container.track.controller, authMiddleware)
  );
  router.use(
    "/albums",
    createAlbumRoutes(container.album.controller, authMiddleware)
  );
  router.use(
    "/playlists",
    createPlaylistRoutes(container.playlist.controller, authMiddleware)
  );

  return router;
}
