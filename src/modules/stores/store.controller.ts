import { Response, NextFunction } from "express";
import * as storeService from "./store.service";
import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/auth-request";

export const createStore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const store = await storeService.createStore(req.user!, req.body);

    return successResponse(res, store, "Store created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyStores = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stores = await storeService.getMyStores(req.user!);

    return successResponse(res, stores, "Stores fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const store = await storeService.getStoreById(
      String(req.params.id),
      req.user!,
    );

    return successResponse(res, store, "Store fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const store = await storeService.updateStore(
      String(req.params.id),
      req.user!,
      req.body,
    );

    return successResponse(res, store, "Store updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await storeService.deleteStore(
      String(req.params.id),
      req.user!,
    );

    return successResponse(res, result, "Store deleted successfully");
  } catch (error) {
    next(error);
  }
};
