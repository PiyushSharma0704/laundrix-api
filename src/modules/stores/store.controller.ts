// src/modules/stores/store.controller.ts
import { Request, Response, NextFunction } from "express";
import * as storeService from "./store.service";
import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/auth-request";

export const createStore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const store = await storeService.createStore(req.user!.id, req.body);

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
    const stores = await storeService.getMyStores(req.user!.id);

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
    const storeId = req.params.id as string;

    const store = await storeService.getStoreById(storeId, req.user!.id);

    return successResponse(res, store, "Store fetched successfully");
  } catch (error) {
    next(error);
  }
};
