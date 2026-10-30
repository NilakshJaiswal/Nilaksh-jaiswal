import { Router } from "express";
import { z } from "zod";
import { About, IAboutContent } from "../models/About";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { plain } from "../utils/plain";

const router = Router();

async function getOrCreateSingleton() {
  let doc = await About.findOne({ singletonKey: "singleton" });
  if (!doc) {
    doc = await About.create({ singletonKey: "singleton" });
  }
  return doc;
}

const aboutContentSchema = z.object({
  heading: z.string().max(120).optional(),
  introduction: z.string().max(1000).optional(),
  biography: z.string().max(5000).optional(),
  professionalTitle: z.string().max(120).optional(),
  education: z.string().max(200).optional(),
  profileImage: z.string().max(2000).optional(),
  supportingImages: z.array(z.string()).optional(),
  resumeUrl: z.string().max(2000).optional(),
  ctaLabel: z.string().max(40).optional(),
  ctaLink: z.string().max(500).optional(),
  visible: z.boolean().optional(),
});

// Public: published content only.
router.get(
  "/about",
  asyncHandler(async (req, res) => {
    const doc = await About.findOne({ singletonKey: "singleton" });
    if (!doc?.published || doc.published.visible === false) {
      res.json(null);
      return;
    }
    res.json(doc.published);
  })
);

// Admin: draft content (what the admin edits).
router.get(
  "/admin/about",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    res.json({ draft: doc.draft, published: doc.published ?? null, updatedAt: doc.updatedAt });
  })
);

// Admin: save draft (does not affect what's publicly visible).
router.put(
  "/admin/about",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = aboutContentSchema.partial().parse(req.body);
    const doc = await getOrCreateSingleton();
    doc.draft = { ...plain<IAboutContent>(doc.draft), ...parsed } as IAboutContent;
    await doc.save();
    res.json({ draft: doc.draft });
  })
);

// Admin: publish the current draft.
router.post(
  "/admin/about/publish",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    doc.published = doc.draft;
    await doc.save();
    res.json({ published: doc.published });
  })
);

export default router;
