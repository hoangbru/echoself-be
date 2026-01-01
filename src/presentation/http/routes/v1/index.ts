import { Router } from "express";

import { AppContainer } from "@/infrastructure/container/AppContainer";

import { createUserRoutes } from "./user.routes";
import { createTrackRoutes } from "./track.routes";
import { createAlbumRoutes } from "./album.routes";
import { createPlaylistRoutes } from "./playlist.routes";

export function createV1Routes(container: AppContainer): Router {
  const router = Router();

  router.use("/users", createUserRoutes(container.user.controller));
  router.use("/tracks", createTrackRoutes(container.track.controller));
  router.use("/albums", createAlbumRoutes(container.album.controller));
  router.use("/playlists", createPlaylistRoutes(container.playlist.controller));

  return router;
}
