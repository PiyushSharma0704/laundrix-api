// business.controller.ts

import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types/auth-request";
import * as businessService from "./business.service";
import { successResponse } from "../../utils/response";

export const createBusiness = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const business = await businessService.createBusiness(
      req.user!.id,
      req.body,
    );

    return successResponse(res, business, "Business created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyBusiness = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const business =
      await businessService.getMyBusiness(
        req.user!.id,
      );

    return successResponse(
      res,
      business,
      "Business fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const businessId = req.params.id as string;

    const business = await businessService.getBusinessById(
      businessId,
      req.user!.id,
    );

    return successResponse(res, business, "Business fetched successfully");
  } catch (error) {
    next(error);
  }
};
