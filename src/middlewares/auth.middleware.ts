import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env";
import { Role } from "../generated/prisma/client";

function unauthorized(response: Response): void {
  response.status(401).json({
    error: { message: "Authentication is required." },
  });
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    unauthorized(response);
    return;
  }

  try {
    const decoded = jwt.verify(authorization.slice(7), env.jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      (decoded as JwtPayload).role !== Role.ADMIN && (decoded as JwtPayload).role !== Role.CUSTOMER
    ) {
      unauthorized(response);
      return;
    }

    request.auth = {
      userId: decoded.sub,
      role: (decoded as JwtPayload).role as Role,
    };
    next();
  } catch {
    unauthorized(response);
  }
}

export function requireRole(...roles: Role[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      response.status(403).json({
        error: { message: "You do not have permission to perform this action." },
      });
      return;
    }

    next();
  };
}
