// src/middleware/auth.middleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth-request";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "@/utils/AppError";
import { prisma } from "../config/prisma";



export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedError("Not authenticated");
    }

    let payload: { userId: string };
    try {
      payload = verifyAccessToken(token) as { userId: string };
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    req.user = { id: user.id, role: user.role };

    next();
  } catch (error) {
    next(error);
  }
};
