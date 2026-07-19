import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

async function start(): Promise<void> {
  await prisma.$connect();
  console.log("Connected to PostgreSQL.");

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}.`);
  });
}

start().catch(async (error: unknown) => {
  console.error("Failed to start the server.", error);
  await prisma.$disconnect();
  process.exit(1);
});
