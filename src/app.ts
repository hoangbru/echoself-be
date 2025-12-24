import express, { Application } from "express";
import cors from "cors";

import { routes } from "./routes";
import { errorMiddleware } from "./shared/errors/error.middleware";

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", routes);

  app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use(errorMiddleware);

  return app;
}
