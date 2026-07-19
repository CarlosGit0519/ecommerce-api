import { z } from "zod";

export const orderParamsSchema = z.object({
  orderId: z.string().cuid(),
});
