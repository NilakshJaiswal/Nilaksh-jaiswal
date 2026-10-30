import { z } from "zod";
import { Skill } from "../models/Skill";
import { buildListResource } from "../utils/listResource";

const createSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.string().min(1).max(60),
  icon: z.string().max(60).optional(),
  level: z.string().max(40).optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});
const updateSchema = createSchema.partial();

export const { publicRouter: skillsPublicRouter, adminRouter: skillsAdminRouter } = buildListResource({
  model: Skill,
  createSchema,
  updateSchema,
  publicFilter: { visible: true },
  defaultSort: { category: 1, order: 1 },
});
