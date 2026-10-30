import { z } from "zod";
import { Service } from "../models/Service";
import { buildListResource } from "../utils/listResource";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().max(60).optional(),
  image: z.string().max(2000).optional(),
  ctaLabel: z.string().max(40).optional(),
  ctaLink: z.string().max(500).optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});
const updateSchema = createSchema.partial();

export const { publicRouter: servicesPublicRouter, adminRouter: servicesAdminRouter } = buildListResource({
  model: Service,
  createSchema,
  updateSchema,
  publicFilter: { visible: true },
  defaultSort: { order: 1 },
});
