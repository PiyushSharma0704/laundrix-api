import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
