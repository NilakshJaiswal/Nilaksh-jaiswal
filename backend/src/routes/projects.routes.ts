import { Router } from "express";
import { z } from "zod";
import { Project } from "../models/Project";
import { buildListResource } from "../utils/listResource";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const createSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().max(140).optional(),
  category: z.string().max(80).optional(),
  shortDescription: z.string().max(280).optional(),
  fullDescription: z.string().max(5000).optional(),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().max(500).optional(),
  liveUrl: z.string().max(500).optional(),
  thumbnail: z.string().max(2000).optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published"]).optional(),
});
const updateSchema = createSchema.partial();

export const { publicRouter: projectsPublicRouter, adminRouter: baseAdminRouter } = buildListResource({
  model: Project,
  createSchema,
  updateSchema,
  publicFilter: { status: "published" },
  defaultSort: { order: 1, createdAt: -1 },
});

// Wrap the generated admin router to auto-slugify on create, and add
// publish/unpublish convenience endpoints, without duplicating the CRUD code.
const projectsAdminRouter = Router();

projectsAdminRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const slugSource = req.body.slug || req.body.title || "";
    const slug = slugify(slugSource);
    if (!slug) throw new ApiError(400, "Title or slug is required.");
    const existing = await Project.findOne({ slug });
    if (existing) throw new ApiError(409, "A project with this slug already exists.");
    const data = createSchema.parse({ ...req.body, slug });
    const item = await Project.create(data);
    res.status(201).json(item);
  })
);

projectsAdminRouter.post(
  "/:id/publish",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Project.findByIdAndUpdate(req.params.id, { status: "published" }, { new: true });
    if (!item) throw new ApiError(404, "Not found.");
    res.json(item);
  })
);

projectsAdminRouter.post(
  "/:id/unpublish",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const item = await Project.findByIdAndUpdate(req.params.id, { status: "draft" }, { new: true });
    if (!item) throw new ApiError(404, "Not found.");
    res.json(item);
  })
);

// Mount the remaining generated routes (GET list, PUT reorder, PUT :id, DELETE :id).
projectsAdminRouter.use(baseAdminRouter);

export { projectsAdminRouter };
