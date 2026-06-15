// src/modules/customers/customer.controller.ts

import { Response, NextFunction } from "express";
import * as customerService from "./customer.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQuery,
} from "./customer.types";
import { successResponse } from "@/utils/response";
import { AuthRequest } from "@/types/auth-request";
import { validateStoreAccess } from "@/middleware/store-access";
import { ForbiddenError } from "@/utils/AppError";

export const createCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateCustomerDto = req.body;

    if (!payload.storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, payload.storeId);

    const customer = await customerService.createCustomer(payload);

    return successResponse(res, customer, "Customer created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    const customer = await customerService.getCustomerById(id, storeId);

    return successResponse(res, customer, "Customer fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getCustomersHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    const query: CustomerQuery = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: req.query.search as string | undefined,
    };

    const result = await customerService.getCustomers(storeId, query);

    return successResponse(res, result, "Customers fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    const payload: UpdateCustomerDto = req.body;

    const customer = await customerService.updateCustomer(id, storeId, payload);

    return successResponse(res, customer, "Customer updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    const result = await customerService.deleteCustomer(id, storeId);

    return successResponse(res, result, "Customer deleted successfully");
  } catch (err) {
    next(err);
  }
};