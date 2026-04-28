import "dotenv/config";
import app from "./app";
import { runStartupSeed } from "./startup-seed";

// Catch anything that would otherwise kill the process
process.on("uncaughtException", (err) => {
  console.error("[crash] uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[crash] unhandledRejection:", reason);
});

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);
const resolvedPort = Number.isNaN(port) || port <= 0 ? 3000 : port;

console.log(`[startup] PORT env="${process.env["PORT"]}" resolvedPort=${resolvedPort}`);
console.log(`[startup] DATABASE_URL set=${!!process.env["DATABASE_URL"]}`);
console.log(`[startup] NODE_ENV=${process.env["NODE_ENV"]}`);

// Start listening immediately so the port is bound before any DB work
app.listen(resolvedPort, () => {
  console.log(`[startup] Server listening on port ${resolvedPort}`);
  // Run DB schema bootstrap + admin seed in the background
  runStartupSeed()
    .then(() => console.log("[seed] ready"))
    .catch((err) => console.error("[seed] error:", err));
});
