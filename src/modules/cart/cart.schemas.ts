import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(100),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(100),
});

export const cartItemParamsSchema = z.object({
  itemId: z.string().cuid(),
});
