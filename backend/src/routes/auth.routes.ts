import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Admin } from "../models/Admin";
import { signAdminToken } from "../utils/jwt";
import { ADMIN_COOKIE_NAME, requireAdmin, AuthedRequest } from "../middleware/auth";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { env } from "../config/env";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in a few minutes." },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Email and password are required.");
    }
    const { email, password } = parsed.data;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      throw new ApiError(401, "Invalid email or password.");
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      throw new ApiError(401, "Invalid email or password.");
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken({ adminId: admin.id, email: admin.email });
    res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions());
    res.json({ email: admin.email });
  })
);

router.post("/logout", (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ email: req.admin!.email });
});

export default router;
