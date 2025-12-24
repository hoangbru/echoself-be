import "dotenv/config";
import { createServer } from "http";

import { createApp } from "./app";
import { prisma } from "./infrastructure/prisma/prisma.client";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    const app = createApp();
    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n Received ${signal}. Shutting down...`);

      await prisma.$disconnect();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
}

bootstrap();
