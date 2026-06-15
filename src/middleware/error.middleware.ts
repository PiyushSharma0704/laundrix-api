// error.middleware.ts
import { Request, Response, NextFunction } from "express";

const STATUS_MAP: Record<string, number> = {
  "Invalid credentials": 400,
  "User already exists": 400,
  "Store slug already exists": 400,
  "User not found": 404,
  "Invalid refresh token": 401,
  "Account is deactivated": 403,
  "Current password is incorrect": 400,
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("ERROR:", err.message);

  const statusCode = err.statusCode || STATUS_MAP[err.message] || 500;

  return res.status(statusCode).json({
    status: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};