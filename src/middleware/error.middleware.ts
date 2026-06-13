// // error.middleware.ts
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(err.statusCode || 500).json({
    status: 0,
    message: err.message || "Internal Server Error",
    data: null,
  });
};
