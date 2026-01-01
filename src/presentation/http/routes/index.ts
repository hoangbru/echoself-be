import { Router } from "express";

import { AppContainer } from "@/infrastructure/container/AppContainer";
import { createV1Routes } from "./v1";
import { createHealthRoutes } from "./health.routes";

export function setupRoutes(container: AppContainer): Router {
  const router = Router();

  router.use("/api/health", createHealthRoutes());

  router.use("/api/v1", createV1Routes(container));

  // future
  // router.use("/api/v2", createV2Routes(container));

  return router;
}
