import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware";
import { getMe, login, register } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, getMe);
