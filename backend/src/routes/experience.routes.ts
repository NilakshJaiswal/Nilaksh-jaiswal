import { z } from "zod";
import { Experience } from "../models/Experience";
import { buildListResource } from "../utils/listResource";

const createSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  employmentType: z.string().max(40).optional(),
  location: z.string().max(120).optional(),
  startDate: z.coerce.date(),
  // Empty string / null (e.g. "currently working here") means no end date.
  endDate: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.date().optional()),
  currentlyWorking: z.boolean().optional(),
  description: z.string().max(2000).optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});
const updateSchema = createSchema.partial();

export const { publicRouter: experiencePublicRouter, adminRouter: experienceAdminRouter } = buildListResource({
  model: Experience,
  createSchema,
  updateSchema,
  publicFilter: { visible: true },
  defaultSort: { order: 1, startDate: -1 },
});
