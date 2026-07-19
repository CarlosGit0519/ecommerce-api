import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "./cart.controller";

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get("/", getCart);
cartRouter.post("/items", addCartItem);
cartRouter.patch("/items/:itemId", updateCartItem);
cartRouter.delete("/items/:itemId", removeCartItem);
