import { Response, NextFunction } from "express";

import * as garmentCategoryService from "./garment-category.service";

import { successResponse } from "@/utils/response";
import { AuthRequest } from "@/types/auth-request";

export const createGarmentCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await garmentCategoryService.createCategory(
      req.user!,
      req.body,
    );

    return successResponse(
      res,
      category,
      "Garment category created successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getGarmentCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await garmentCategoryService.getCategories(req.user!);

    return successResponse(
      res,
      categories,
      "Garment categories fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getActiveGarmentCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await garmentCategoryService.getActiveCategories(
      req.user!,
    );

    return successResponse(
      res,
      categories,
      "Active garment categories fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getGarmentCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await garmentCategoryService.getCategoryById(
      String(req.params.id),
      req.user!,
    );

    return successResponse(
      res,
      category,
      "Garment category fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateGarmentCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await garmentCategoryService.updateCategory(
      String(req.params.id),
      req.user!,
      req.body,
    );

    return successResponse(
      res,
      category,
      "Garment category updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateGarmentCategoryStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await garmentCategoryService.updateCategoryStatus(
      String(req.params.id),
      req.user!,
      req.body.isActive,
    );

    return successResponse(
      res,
      category,
      `Garment category ${
        req.body.isActive ? "activated" : "archived"
      } successfully`,
    );
  } catch (error) {
    next(error);
  }
};
