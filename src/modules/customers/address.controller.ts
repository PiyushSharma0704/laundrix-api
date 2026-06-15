// src/modules/customers/address.controller.ts

import { Request, Response, NextFunction } from "express";
import * as addressService from "./address.service";
import { successResponse } from "../../utils/response";

export const createAddressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;

    const address = await addressService.createAddress(
      customerId,
      req.body,
    );

    return successResponse(
      res,
      address,
      "Address created successfully",
      201,
    );
  } catch (err) {
    next(err);
  }
};

export const getAddressesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;

    const addresses = await addressService.getAddresses(
      customerId,
    );

    return successResponse(
      res,
      addresses,
      "Addresses fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};

export const getAddressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;

    const address = await addressService.getAddressById(
      customerId,
      addressId,
    );

    return successResponse(
      res,
      address,
      "Address fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};

export const updateAddressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;

    const address = await addressService.updateAddress(
      customerId,
      addressId,
      req.body,
    );

    return successResponse(
      res,
      address,
      "Address updated successfully",
    );
  } catch (err) {
    next(err);
  }
};

export const deleteAddressHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.params.customerId as string;
    const addressId = req.params.addressId as string;

    const result = await addressService.deleteAddress(
      customerId,
      addressId,
    );

    return successResponse(
      res,
      result,
      "Address deleted successfully",
    );
  } catch (err) {
    next(err);
  }
};