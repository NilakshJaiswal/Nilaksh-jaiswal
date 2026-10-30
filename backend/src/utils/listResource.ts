import { Router } from "express";
import { Model, Document } from "mongoose";
import { ZodType } from "zod";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

interface ListResourceOptions<T> {
  model: Model<T>;
  createSchema: ZodType<any>;
  updateSchema: ZodType<any>;
  /** Field name that marks public visibility: "visible" (bool) or "status" (draft/published). */
  publicFilter: Record<string, any>;
  defaultSort: Record<string, 1 | -1>;
}

/**
 * Builds a public GET list + a full admin CRUD/reorder route set for a
 * simple ordered list resource (Skill, Service, Experience, Project).
 * Mounted twice by the caller: the public route under `/api`, the admin
 * routes under `/api/admin`.
 */
export function buildListResource<T extends Document>(opts: ListResourceOptions<T>) {
  const { model, createSchema, updateSchema, publicFilter, defaultSort } = opts;

  const publicRouter = Router();
  publicRouter.get(
    "/",
    asyncHandler(async (req, res) => {
      const items = await model.find(publicFilter).sort(defaultSort);
      res.json(items);
    })
  );

  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get(
    "/",
    asyncHandler(async (req, res) => {
      const items = await model.find({}).sort(defaultSort);
      res.json(items);
    })
  );

  adminRouter.post(
    "/",
    asyncHandler(async (req, res) => {
      const data = createSchema.parse(req.body);
      const item = await model.create(data);
      res.status(201).json(item);
    })
  );

  adminRouter.put(
    "/reorder",
    asyncHandler(async (req, res) => {
      const body = req.body as { order: { id: string; order: number }[] };
      if (!Array.isArray(body?.order)) {
        throw new ApiError(400, "Expected { order: [{ id, order }] }.");
      }
      await Promise.all(
        body.order.map(({ id, order }) =>
          model.updateOne({ _id: id }, { $set: { order } }).exec()
        )
      );
      res.json({ ok: true });
    })
  );

  adminRouter.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const data = updateSchema.parse(req.body);
      const item = await model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
      if (!item) throw new ApiError(404, "Not found.");
      res.json(item);
    })
  );

  adminRouter.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const item = await model.findByIdAndDelete(req.params.id);
      if (!item) throw new ApiError(404, "Not found.");
      res.json({ ok: true });
    })
  );

  return { publicRouter, adminRouter };
}
