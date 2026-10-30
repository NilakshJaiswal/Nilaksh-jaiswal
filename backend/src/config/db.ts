import mongoose from "mongoose";
import "./dns";
import { env } from "./env";

// One shared connection promise. On a long-running server it runs once; on a
// serverless host (Vercel) a warm function reuses it between requests instead
// of opening a new connection every time.
let connecting: Promise<typeof mongoose> | null = null;

export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", true);
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    connecting = mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 10000 });
  }
  try {
    await connecting;
    // eslint-disable-next-line no-console
    console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);
  } catch (err) {
    connecting = null;
    // eslint-disable-next-line no-console
    console.error("[db] Failed to connect to MongoDB:", (err as Error).message);
    throw err;
  }
}

mongoose.connection.on("disconnected", () => {
  // eslint-disable-next-line no-console
  console.warn("[db] MongoDB disconnected");
});
