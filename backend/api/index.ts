// Vercel serverless entry point. Vercel compiles this file itself and sends
// every request here (see vercel.json); Express then routes it as normal.
import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../src/app";
import { connectDB } from "../src/config/db";
import { assertCoreEnv } from "../src/config/env";

const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    assertCoreEnv();
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Server is not configured correctly: " + (err as Error).message }));
    return;
  }
  return app(req as any, res as any);
}
