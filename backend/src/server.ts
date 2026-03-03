import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════╗
  ║   Alpha Backend — ${env.NODE_ENV}
  ║   Running on port ${env.PORT}
  ╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
    // Force exit after 10s
    setTimeout(() => {
        console.error("Forced shutdown after timeout.");
        process.exit(1);
    }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
