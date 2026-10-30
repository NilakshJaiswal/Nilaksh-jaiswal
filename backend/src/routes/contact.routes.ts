import { Router } from "express";
import { z } from "zod";
import { Contact, IContactContent } from "../models/Contact";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { plain } from "../utils/plain";

const router = Router();

async function getOrCreateSingleton() {
  let doc = await Contact.findOne({ singletonKey: "singleton" });
  if (!doc) {
    doc = await Contact.create({ singletonKey: "singleton" });
  }
  return doc;
}

const contactContentSchema = z.object({
  heading: z.string().max(120).optional(),
  description: z.string().max(500).optional(),
  email: z.string().email().max(200).optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  location: z.string().max(120).optional(),
  githubUrl: z.string().max(500).optional(),
  linkedinUrl: z.string().max(500).optional(),
  otherSocialLinks: z.array(z.object({ label: z.string().max(40), url: z.string().max(500) })).optional(),
  ctaLabel: z.string().max(40).optional(),
  contactFormEnabled: z.boolean().optional(),
});

router.get(
  "/contact",
  asyncHandler(async (req, res) => {
    const doc = await Contact.findOne({ singletonKey: "singleton" });
    res.json(doc?.published ?? null);
  })
);

router.get(
  "/admin/contact",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    res.json({ draft: doc.draft, published: doc.published ?? null, updatedAt: doc.updatedAt });
  })
);

router.put(
  "/admin/contact",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = contactContentSchema.partial().parse(req.body);
    const doc = await getOrCreateSingleton();
    doc.draft = { ...plain<IContactContent>(doc.draft), ...parsed } as IContactContent;
    await doc.save();
    res.json({ draft: doc.draft });
  })
);

router.post(
  "/admin/contact/publish",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    doc.published = doc.draft;
    await doc.save();
    res.json({ published: doc.published });
  })
);

export default router;
