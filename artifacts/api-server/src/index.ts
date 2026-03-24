import app from "./app";
import { runStartupSeed } from "./startup-seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Run schema bootstrap + admin seed before accepting requests
runStartupSeed().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  // If seed crashes fatally, still start the server
  console.error("[seed] fatal error, starting anyway:", err);
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
