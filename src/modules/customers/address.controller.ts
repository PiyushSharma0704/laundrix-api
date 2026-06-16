// src/modules/customers/address.controller.ts

import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/auth-request";
import { ForbiddenError } from "@/utils/AppError";
import { validateStoreAccess } from "@/middleware/store-access";
import { successResponse } from "@/utils/response";
import { ensureCustomerBelongsToStore } from "@/utils/helpers";
import * as addressService from "./address.service";

export const createAddressHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;

    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    await ensureCustomerBelongsToStore(customerId, storeId);

    const address = await addressService.createAddress(customerId, req.body);

    return successResponse(res, address, "Address created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getAddressesHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    await ensureCustomerBelongsToStore(customerId, storeId);

    const addresses = await addressService.getAddresses(customerId);

    return successResponse(res, addresses, "Addresses fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getAddressHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    await ensureCustomerBelongsToStore(customerId, storeId);

    const address = await addressService.getAddressById(customerId, addressId);

    return successResponse(res, address, "Address fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateAddressHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    await ensureCustomerBelongsToStore(customerId, storeId);

    const address = await addressService.updateAddress(
      customerId,
      addressId,
      req.body,
    );

    return successResponse(res, address, "Address updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteAddressHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;
    const storeId = req.query.storeId as string;

    if (!storeId) {
      throw new ForbiddenError("storeId is required");
    }

    await validateStoreAccess(req.user!.id, storeId);

    await ensureCustomerBelongsToStore(customerId, storeId);

    const result = await addressService.deleteAddress(customerId, addressId);

    return successResponse(res, result, "Address deleted successfully");
  } catch (err) {
    next(err);
  }
};
