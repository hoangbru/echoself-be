import { Router } from "express";

export function createHealthRoutes(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  return router;
}
