import express from "express";
import { ZodError } from "zod";

import { authRouter } from "./modules/auth/auth.routes";
import { categoryRouter } from "./modules/categories/category.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { productRouter } from "./modules/products/product.routes";
import { orderRouter } from "./modules/orders/order.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        message: "Invalid request data.",
        details: error.flatten(),
      },
    });
    return;
  }

  console.error(error);
  response.status(500).json({
    error: { message: "Internal server error." },
  });
});
