import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().trim().min(3).max(50).toUpperCase(),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().positive().max(999999.99),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().cuid(),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().cuid().optional(),
  search: z.string().trim().min(1).max(200).optional(),
});

export const productParamsSchema = z.object({
  productId: z.string().cuid(),
});

export const updateProductSchema = z.object({
  sku: z.string().trim().min(3).max(50).toUpperCase().optional(),
  name: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  price: z.coerce.number().positive().max(999999.99).optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  categoryId: z.string().cuid().optional(),
});
