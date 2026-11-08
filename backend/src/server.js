require("dotenv").config();

const app = require("./app");
const prisma = require("./config/prisma");

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    const server = app.listen(PORT, () => {
      console.log(`MeetMind-AI API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    async function shutdown(signal) {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start the API:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();