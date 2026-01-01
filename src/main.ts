import express, { Application } from "express";
import dotenv from "dotenv";

dotenv.config();

import {
  corsMiddleware,
  requestLogger,
  errorHandler,
  notFoundHandler,
  apiLimiter,
} from "./presentation/http/middlewares";
import { AppContainer } from "./infrastructure/container/AppContainer";
import { setupRoutes } from "./presentation/http/routes";
import { logger } from "./shared/utils/logger";

class Server {
  private app: Application;
  private container: AppContainer;
  private port: number;

  constructor() {
    this.app = express();
    this.container = AppContainer.getInstance();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(corsMiddleware);
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logger
    this.app.use(requestLogger);

    // Rate limiter
    this.app.use("/api", apiLimiter);
  }

  private setupRoutes(): void {
    this.app.use(setupRoutes(this.container));
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await this.container.prismaContainer.connect();
      logger.info("Database connected successfully");

      this.app.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
        logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
        logger.info(`Health check: http://localhost:${this.port}/api/health`);
        logger.info(`API v1: http://localhost:${this.port}/api/v1`);
      });

      this.setupGracefulShutdown();
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      try {
        await this.container.prismaContainer.disconnect();
        logger.info("Database disconnected");

        logger.info("Server closed");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

const server = new Server();
server.start();

export default server;
