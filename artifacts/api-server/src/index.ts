import app from "./app";
import { runStartupSeed } from "./startup-seed";

const rawPort = process.env["PORT"] ?? "3000";
const port = Number(rawPort);
const resolvedPort = Number.isNaN(port) || port <= 0 ? 3000 : port;

// Run schema bootstrap + admin seed before accepting requests
runStartupSeed().then(() => {
  app.listen(resolvedPort, () => {
    console.log(`Server listening on port ${resolvedPort}`);
  });
}).catch((err) => {
  // If seed crashes fatally, still start the server
  console.error("[seed] fatal error, starting anyway:", err);
  app.listen(resolvedPort, () => {
    console.log(`Server listening on port ${resolvedPort}`);
  });
});
