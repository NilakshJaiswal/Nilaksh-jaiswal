import { Router } from "express";
import { z } from "zod";
import { Settings, ISettingsContent } from "../models/Settings";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { plain } from "../utils/plain";

const router = Router();

async function getOrCreateSingleton() {
  let doc = await Settings.findOne({ singletonKey: "singleton" });
  if (!doc) {
    doc = await Settings.create({ singletonKey: "singleton" });
  }
  return doc;
}

const settingsContentSchema = z.object({
  siteName: z.string().max(80).optional(),
  pageTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(300).optional(),
  favicon: z.string().max(2000).optional(),
  logoText: z.string().max(40).optional(),
  navLabels: z
    .object({
      about: z.string().max(30),
      skills: z.string().max(30),
      projects: z.string().max(30),
      experience: z.string().max(30),
      contact: z.string().max(30),
    })
    .partial()
    .optional(),
  footerText: z.string().max(200).optional(),
  copyrightText: z.string().max(120).optional(),
  heroHeading: z.string().max(80).optional(),
  heroRoleLabel: z.string().max(40).optional(),
  heroTypewriterText: z.string().max(200).optional(),
  heroActions: z.array(z.object({ label: z.string().max(40), link: z.string().max(500) })).optional(),
  backgroundVideoUrl: z.string().max(2000).optional(),
  marqueeItems: z
    .array(z.object({ imageUrl: z.string().max(2000), label: z.string().max(80), isOwnWork: z.boolean() }))
    .optional(),
  sectionVisibility: z
    .object({
      hero: z.boolean(),
      marquee: z.boolean(),
      about: z.boolean(),
      skills: z.boolean(),
      services: z.boolean(),
      projects: z.boolean(),
      experience: z.boolean(),
      contact: z.boolean(),
    })
    .partial()
    .optional(),
});

// Public: the published site-wide settings. Falls back to sensible defaults
// (from the schema) if nothing has been published yet, except the dynamic
// content arrays (marqueeItems, heroActions) which stay empty until the
// admin adds real ones — never fabricated.
router.get(
  "/settings",
  asyncHandler(async (req, res) => {
    const doc = await Settings.findOne({ singletonKey: "singleton" });
    res.json(doc?.published ?? null);
  })
);

router.get(
  "/admin/settings",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    res.json({ draft: doc.draft, published: doc.published ?? null, updatedAt: doc.updatedAt });
  })
);

router.put(
  "/admin/settings",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const parsed = settingsContentSchema.partial().parse(req.body);
    const doc = await getOrCreateSingleton();
    const current = plain<ISettingsContent>(doc.draft);
    doc.draft = {
      ...current,
      ...parsed,
      navLabels: { ...current.navLabels, ...(parsed.navLabels ?? {}) },
      sectionVisibility: { ...current.sectionVisibility, ...(parsed.sectionVisibility ?? {}) },
    } as ISettingsContent;
    await doc.save();
    res.json({ draft: doc.draft });
  })
);

router.post(
  "/admin/settings/publish",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const doc = await getOrCreateSingleton();
    doc.published = doc.draft;
    await doc.save();
    res.json({ published: doc.published });
  })
);

export default router;
