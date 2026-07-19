import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { checkout, listMyOrders } from "./order.controller";

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.post("/checkout", checkout);
orderRouter.get("/", listMyOrders);
