import { Prisma } from "../../generated/prisma/client";
import type { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { orderParamsSchema } from "./order.schemas";
import { assertStockAvailable } from "./order.rules";

const orderInclude = {
  items: {
    include: { product: true },
  },
};

export async function checkout(request: Request, response: Response): Promise<void> {
  try {
    const order = await prisma.$transaction(async (transaction) => {
      const cart = await transaction.cart.findUnique({
        where: { userId: request.auth!.userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart?.items.length) {
        throw new Error("Cart is empty.");
      }

      assertStockAvailable(cart.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        stockQuantity: item.product.stockQuantity,
        unitPrice: Number(item.product.price),
      })));

      let total = new Prisma.Decimal(0);

      for (const item of cart.items) {
        const updatedProduct = await transaction.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stockQuantity: { gte: item.quantity },
          },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        if (updatedProduct.count !== 1) {
          throw new Error(`Insufficient stock for ${item.product.name}.`);
        }

        total = total.add(item.product.price.mul(item.quantity));
      }

      const createdOrder = await transaction.order.create({
        data: {
          userId: request.auth!.userId,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              sku: item.product.sku,
              name: item.product.name,
              unitPrice: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: orderInclude,
      });

      await transaction.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });

    response.status(201).json({ data: { order } });
  } catch (error) {
    if (error instanceof Error && (error.message === "Cart is empty." || error.message.startsWith("Insufficient stock"))) {
      response.status(409).json({
        error: { message: error.message },
      });
      return;
    }

    throw error;
  }
}

export async function listMyOrders(request: Request, response: Response): Promise<void> {
  const orders = await prisma.order.findMany({
    where: { userId: request.auth!.userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

  response.status(200).json({ data: { orders } });
}

export async function confirmPayment(request: Request, response: Response): Promise<void> {
  const { orderId } = orderParamsSchema.parse(request.params);
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: request.auth!.userId,
    },
  });

  if (!order) {
    response.status(404).json({
      error: { message: "Order not found." },
    });
    return;
  }

  if (order.status !== "PENDING") {
    response.status(409).json({
      error: { message: "Only pending orders can be paid." },
    });
    return;
  }

  const paidOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
    include: orderInclude,
  });

  response.status(200).json({ data: { order: paidOrder } });
}
