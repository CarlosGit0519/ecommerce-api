import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
});

export const categoryParamsSchema = z.object({
  categoryId: z.string().cuid(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
});
