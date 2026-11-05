import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env, assertCoreEnv } from "./config/env";
import { connectDB } from "./config/db";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import aboutRoutes from "./routes/about.routes";
import contactRoutes from "./routes/contact.routes";
import contactFormRoutes from "./routes/contactForm.routes";
import settingsRoutes from "./routes/settings.routes";
import { skillsPublicRouter, skillsAdminRouter } from "./routes/skills.routes";
import { servicesPublicRouter, servicesAdminRouter } from "./routes/services.routes";
import { experiencePublicRouter, experienceAdminRouter } from "./routes/experience.routes";
import { projectsPublicRouter, projectsAdminRouter } from "./routes/projects.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", apiLimiter);

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Auth
  app.use("/api/admin", authRoutes);

  // Uploads (admin-only, enforced inside the router)
  app.use("/api/admin/upload", uploadRoutes);

  // Singleton content: About, Contact, Settings
  app.use("/api", aboutRoutes);
  app.use("/api", contactRoutes);
  app.use("/api", contactFormRoutes);
  app.use("/api", settingsRoutes);

  // List content: Skills, Services, Experience, Projects
  app.use("/api/skills", skillsPublicRouter);
  app.use("/api/admin/skills", skillsAdminRouter);

  app.use("/api/services", servicesPublicRouter);
  app.use("/api/admin/services", servicesAdminRouter);

  app.use("/api/experience", experiencePublicRouter);
  app.use("/api/admin/experience", experienceAdminRouter);

  app.use("/api/projects", projectsPublicRouter);
  app.use("/api/admin/projects", projectsAdminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

// ---------------------------------------------------------------------------
// Vercel entrypoint. Vercel auto-detects Express projects and loads
// src/app.ts, which must have a default export that is a request handler.
// It connects to MongoDB (cached between warm invocations) and then hands the
// request to Express. Local dev still uses createApp() via src/server.ts.
// ---------------------------------------------------------------------------
const vercelApp = createApp();

export default async function handler(req: express.Request, res: express.Response) {
  try {
    assertCoreEnv();
    await connectDB();
  } catch (err) {
    res.status(500).json({ error: "Server is not configured correctly: " + (err as Error).message });
    return;
  }
  return vercelApp(req, res);
}