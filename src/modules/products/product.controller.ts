import type { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { createProductSchema, listProductsQuerySchema, productParamsSchema, updateProductSchema } from "./product.schemas";

export async function createProduct(request: Request, response: Response): Promise<void> {
  const input = createProductSchema.parse(request.body);

  const [existingProduct, category] = await Promise.all([
    prisma.product.findUnique({ where: { sku: input.sku } }),
    prisma.category.findFirst({
      where: { id: input.categoryId, isActive: true },
    }),
  ]);

  if (existingProduct) {
    response.status(409).json({
      error: { message: "A product with this SKU already exists." },
    });
    return;
  }

  if (!category) {
    response.status(404).json({
      error: { message: "Active category not found." },
    });
    return;
  }

  const product = await prisma.product.create({
    data: input,
    include: { category: true },
  });

  response.status(201).json({ data: { product } });
}

export async function listProducts(request: Request, response: Response): Promise<void> {
  const query = listProductsQuerySchema.parse(request.query);
  const where = {
    isActive: true,
    categoryId: query.categoryId,
    name: query.search
      ? {
          contains: query.search,
          mode: "insensitive" as const,
        }
      : undefined,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  response.status(200).json({
    data: { products },
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
}

export async function updateProduct(request: Request, response: Response): Promise<void> {
  const { productId } = productParamsSchema.parse(request.params);
  const input = updateProductSchema.parse(request.body);
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    response.status(404).json({ error: { message: "Product not found." } });
    return;
  }

  if (input.sku && input.sku !== product.sku) {
    const duplicate = await prisma.product.findUnique({ where: { sku: input.sku } });
    if (duplicate) {
      response.status(409).json({ error: { message: "A product with this SKU already exists." } });
      return;
    }
  }

  if (input.categoryId && input.categoryId !== product.categoryId) {
    const category = await prisma.category.findFirst({ where: { id: input.categoryId, isActive: true } });
    if (!category) {
      response.status(404).json({ error: { message: "Active category not found." } });
      return;
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: input,
    include: { category: true },
  });
  response.status(200).json({ data: { product: updatedProduct } });
}

export async function deactivateProduct(request: Request, response: Response): Promise<void> {
  const { productId } = productParamsSchema.parse(request.params);
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    response.status(404).json({ error: { message: "Product not found." } });
    return;
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
    include: { category: true },
  });
  response.status(200).json({ data: { product: updatedProduct } });
}
