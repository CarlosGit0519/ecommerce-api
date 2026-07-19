import { Router } from "express";

import { Role } from "../../generated/prisma/client";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { createCategory, listCategories } from "./category.controller";

export const categoryRouter = Router();

categoryRouter.get("/", listCategories);
categoryRouter.post("/", requireAuth, requireRole(Role.ADMIN), createCategory);
