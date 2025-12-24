import { Router } from "express";
import { validate } from "@/shared/middlewares/validate.middleware";
import { getAlbumsQuerySchema } from "./album.query.schema";
import { albumController } from "./album.container";

const router = Router();

router.get(
  "/",
  validate(getAlbumsQuerySchema),
  albumController.getAlbums
);

router.get("/:id", albumController.getAlbumById);

export default router;
