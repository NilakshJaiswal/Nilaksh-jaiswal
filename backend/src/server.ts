import { createApp } from "./app";
import { connectDB } from "./config/db";
import { assertCoreEnv, env } from "./config/env";

async function main() {
  assertCoreEnv();
  await connectDB();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
