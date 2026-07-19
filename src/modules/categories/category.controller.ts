import type { Request, Response } from "express";

import { prisma } from "../../lib/prisma";
import { createCategorySchema } from "./category.schemas";

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
