// src/middleware/authorize.middleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth-request";
import { UserRole } from "@prisma/client";
import { ForbiddenError } from "@/utils/AppError";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    next();
  };
};