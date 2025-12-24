import { Router } from "express";

import songRoutes from "./modules/songs/song.routes";
import albumRoutes from "./modules/albums/album.routes";
import authRoutes from "./modules/auth/auth.routes";

export const routes = Router();

routes.use("/songs", songRoutes);
routes.use("/albums", albumRoutes);
routes.use("/auth", authRoutes);
