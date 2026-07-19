import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Request, Response } from "express";

import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { loginSchema, registerSchema } from "./auth.schemas";

function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
}): object {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function createAccessToken(user: { id: string; role: "ADMIN" | "CUSTOMER" }): string {
  return jwt.sign(
    { role: user.role },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    },
  );
}

export async function register(request: Request, response: Response): Promise<void> {
  const input = registerSchema.parse(request.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    response.status(409).json({
      error: { message: "Email is already registered." },
    });
    return;
  }

  const userCount = await prisma.user.count();
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: userCount === 0 ? "ADMIN" : "CUSTOMER",
    },
  });

  response.status(201).json({
    data: {
      user: serializeUser(user),
      accessToken: createAccessToken(user),
    },
  });
}

export async function login(request: Request, response: Response): Promise<void> {
  const input = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    response.status(401).json({
      error: { message: "Invalid email or password." },
    });
    return;
  }

  response.status(200).json({
    data: {
      user: serializeUser(user),
      accessToken: createAccessToken(user),
    },
  });
}

export async function getMe(request: Request, response: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: request.auth?.userId },
  });

  if (!user) {
    response.status(404).json({
      error: { message: "User not found." },
    });
    return;
  }

  response.status(200).json({
    data: { user: serializeUser(user) },
  });
}
