import { Router } from "express";

import { Role } from "../../generated/prisma/client";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { createCategory, deactivateCategory, listCategories, updateCategory } from "./category.controller";

export const categoryRouter = Router();

categoryRouter.get("/", listCategories);
categoryRouter.post("/", requireAuth, requireRole(Role.ADMIN), createCategory);
categoryRouter.patch("/:categoryId", requireAuth, requireRole(Role.ADMIN), updateCategory);
categoryRouter.patch("/:categoryId/deactivate", requireAuth, requireRole(Role.ADMIN), deactivateCategory);
