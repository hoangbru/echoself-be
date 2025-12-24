import { Router } from "express";

import songRoutes from "./modules/songs/song.routes";

export const routes = Router();

routes.use("/songs", songRoutes);
