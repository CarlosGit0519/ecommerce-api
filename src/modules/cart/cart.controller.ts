import type { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { addCartItemSchema, cartItemParamsSchema, updateCartItemSchema } from "./cart.schemas";

const cartInclude = {
  items: {
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
};

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: cartInclude,
  });
}

export async function getCart(request: Request, response: Response): Promise<void> {
  const cart = await getOrCreateCart(request.auth!.userId);
  response.status(200).json({ data: { cart } });
}

export async function addCartItem(request: Request, response: Response): Promise<void> {
  const input = addCartItemSchema.parse(request.body);
  const product = await prisma.product.findFirst({
    where: { id: input.productId, isActive: true },
  });

  if (!product) {
    response.status(404).json({
      error: { message: "Active product not found." },
    });
    return;
  }

  const cart = await getOrCreateCart(request.auth!.userId);
  const existingItem = cart.items.find((item) => item.productId === product.id);
  const requestedQuantity = (existingItem?.quantity ?? 0) + input.quantity;

  if (requestedQuantity > product.stockQuantity) {
    response.status(409).json({
      error: { message: "Requested quantity exceeds available stock." },
    });
    return;
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: requestedQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: input.quantity,
      },
    });
  }

  const updatedCart = await getOrCreateCart(request.auth!.userId);
  response.status(201).json({ data: { cart: updatedCart } });
}

export async function updateCartItem(request: Request, response: Response): Promise<void> {
  const { itemId } = cartItemParamsSchema.parse(request.params);
  const input = updateCartItemSchema.parse(request.body);
  const cart = await getOrCreateCart(request.auth!.userId);
  const item = cart.items.find((cartItem) => cartItem.id === itemId);

  if (!item) {
    response.status(404).json({
      error: { message: "Cart item not found." },
    });
    return;
  }

  if (input.quantity > item.product.stockQuantity) {
    response.status(409).json({
      error: { message: "Requested quantity exceeds available stock." },
    });
    return;
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: input.quantity },
  });

  const updatedCart = await getOrCreateCart(request.auth!.userId);
  response.status(200).json({ data: { cart: updatedCart } });
}

export async function removeCartItem(request: Request, response: Response): Promise<void> {
  const { itemId } = cartItemParamsSchema.parse(request.params);
  const cart = await getOrCreateCart(request.auth!.userId);
  const item = cart.items.find((cartItem) => cartItem.id === itemId);

  if (!item) {
    response.status(404).json({
      error: { message: "Cart item not found." },
    });
    return;
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  response.status(204).send();
}
