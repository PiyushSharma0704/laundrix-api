// auth.middleware.ts
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
