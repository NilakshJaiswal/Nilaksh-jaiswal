import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { env } from "../config/env";
import { Contact } from "../models/Contact";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

const submissionSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

const smtpConfigured = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.receivingEmail);

router.post(
  "/contact-form",
  submitLimiter,
  asyncHandler(async (req, res) => {
    const contactDoc = await Contact.findOne({ singletonKey: "singleton" });
    if (!contactDoc?.published?.contactFormEnabled) {
      throw new ApiError(404, "The contact form is not enabled.");
    }
    if (!smtpConfigured) {
      throw new ApiError(
        503,
        "The contact form is enabled but no email delivery service is configured on the server. " +
          "Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_RECEIVING_EMAIL in the backend .env, " +
          "then restart the server. No message was sent."
      );
    }

    const data = submissionSchema.parse(req.body);

    // Lazy-import so the dependency is only required when the form is actually enabled.
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });

    await transporter.sendMail({
      from: env.smtp.user,
      to: env.smtp.receivingEmail,
      replyTo: data.email,
      subject: `Portfolio contact form: ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    });

    res.json({ ok: true });
  })
);

export default router;
