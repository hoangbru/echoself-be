import { Router } from "express";
import { songController } from "./song.container";
import { validate } from "@/shared/middlewares/validate.middleware";
import { getSongsQuerySchema } from "./song.query.schema";

const router = Router();

router.get("/", validate(getSongsQuerySchema), songController.getSongs);

export default router;
