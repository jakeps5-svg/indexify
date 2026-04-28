import "dotenv/config";
import app from "./app";
import { runStartupSeed } from "./startup-seed";

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);
const resolvedPort = Number.isNaN(port) || port <= 0 ? 3000 : port;

// Start listening immediately so the port is bound before any DB work
app.listen(resolvedPort, () => {
  console.log(`Server listening on port ${resolvedPort}`);
  // Run DB schema bootstrap + admin seed in the background
  runStartupSeed()
    .then(() => console.log("[seed] ready"))
    .catch((err) => console.error("[seed] error:", err));
});
