// auth.controller.ts
import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { successResponse } from "../../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, "Registration successful", 201);
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
    return successResponse(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.me(req.user!.userId);
    return successResponse(res, result, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return successResponse(res, result, "Token refreshed successfully");
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.logout(req.user!.userId);
    return successResponse(res, result, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    return successResponse(res, result, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};
