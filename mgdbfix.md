 Update(src\config\env.ts)
Added 4 lines
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  dnsServers: (process.env.DNS_SERVERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  mongodbUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

● Update(src\server.ts)
Added 1 line
import "./config/dns";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { assertCoreEnv, env } from "./config/env";
