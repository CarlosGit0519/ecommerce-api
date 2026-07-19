import type { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from "./category.schemas";

export async function createCategory(request: Request, response: Response): Promise<void> {
  const input = createCategorySchema.parse(request.body);
  const existingCategory = await prisma.category.findUnique({
    where: { name: input.name },
  });

  if (existingCategory) {
    response.status(409).json({
      error: { message: "A category with this name already exists." },
    });
    return;
  }

  const category = await prisma.category.create({
    data: { name: input.name },
  });

  response.status(201).json({ data: { category } });
}

export async function listCategories(_request: Request, response: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  response.status(200).json({ data: { categories } });
}

export async function updateCategory(request: Request, response: Response): Promise<void> {
  const { categoryId } = categoryParamsSchema.parse(request.params);
  const input = updateCategorySchema.parse(request.body);
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    response.status(404).json({ error: { message: "Category not found." } });
    return;
  }

  if (input.name && input.name !== category.name) {
    const duplicate = await prisma.category.findUnique({ where: { name: input.name } });
    if (duplicate) {
      response.status(409).json({ error: { message: "A category with this name already exists." } });
      return;
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: input,
  });
  response.status(200).json({ data: { category: updatedCategory } });
}

export async function deactivateCategory(request: Request, response: Response): Promise<void> {
  const { categoryId } = categoryParamsSchema.parse(request.params);
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    response.status(404).json({ error: { message: "Category not found." } });
    return;
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: false },
  });
  response.status(200).json({ data: { category: updatedCategory } });
}
