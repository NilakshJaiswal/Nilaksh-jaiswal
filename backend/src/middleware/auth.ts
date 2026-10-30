import { Request, Response, NextFunction } from "express";
import { verifyAdminToken } from "../utils/jwt";

export const ADMIN_COOKIE_NAME = "portfolio_admin_session";

export interface AuthedRequest extends Request {
  admin?: { adminId: string; email: string };
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }
  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
}
