import { Router } from "express";

import { Role } from "../../generated/prisma/client";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { createProduct, listProducts } from "./product.controller";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.post("/", requireAuth, requireRole(Role.ADMIN), createProduct);
