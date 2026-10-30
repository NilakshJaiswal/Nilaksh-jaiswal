/**
 * One-time administrator setup.
 *
 * Run with: npm run create-admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env. Creates exactly one
 * administrator account and only when no administrator exists yet — this
 * script refuses to run again (or to reset a password) once an account is
 * present, so it cannot be used to silently take over an existing site.
 * To rotate credentials later, change the password manually in the database
 * or build a dedicated authenticated "change password" admin flow.
 *
 * This script does NOT seed any portfolio content (About, Projects, Skills,
 * etc.) — only the administrator account, per the no-hardcoded-content
 * requirement.
 */
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { assertCoreEnv } from "../config/env";
import { Admin } from "../models/Admin";
import mongoose from "mongoose";

dotenv.config();

async function main() {
  assertCoreEnv();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running this script.");
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("ADMIN_PASSWORD must be at least 10 characters. Choose a strong password.");
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.countDocuments();
  if (existing > 0) {
    console.error(
      "An administrator account already exists. Refusing to create another one from this script. " +
        "If you need to recover access, update the account directly in the database."
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });

  console.log(`Administrator account created for ${email}. You can now log in at /admin/login.`);
  console.log("For safety, consider removing ADMIN_PASSWORD from your .env file now that setup is complete.");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to create administrator account:", err);
  process.exit(1);
});
