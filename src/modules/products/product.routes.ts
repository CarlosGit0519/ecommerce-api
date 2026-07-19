import { Router } from "express";

import { Role } from "../../generated/prisma/client";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { createProduct, deactivateProduct, listProducts, updateProduct } from "./product.controller";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.post("/", requireAuth, requireRole(Role.ADMIN), createProduct);
productRouter.patch("/:productId", requireAuth, requireRole(Role.ADMIN), updateProduct);
productRouter.patch("/:productId/deactivate", requireAuth, requireRole(Role.ADMIN), deactivateProduct);
