// src/modules/customers/customer.controller.ts

import { Response, NextFunction } from "express";
import * as customerService from "./customer.service";
import {
  CustomerQuery,
} from "./customer.types";
import { successResponse } from "@/utils/response";
import { AuthRequest } from "@/types/auth-request";

export const createCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer =
      await customerService.createCustomer(
        req.user!,
        req.body
      );

    return successResponse(
      res,
      customer,
      "Customer created successfully",
      201
    );
  } catch (err) {
    next(err);
  }
};

export const getCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.params.id as string;

    const customer =
      await customerService.getCustomerById(
        customerId,
        req.user!
      );

    return successResponse(
      res,
      customer,
      "Customer fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getCustomersHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: CustomerQuery = {
      page: req.query.page
        ? Number(req.query.page)
        : undefined,

      limit: req.query.limit
        ? Number(req.query.limit)
        : undefined,

      search:
        req.query.search as string | undefined,
    };

    const result =
      await customerService.getCustomers(
        req.user!,
        query
      );

    return successResponse(
      res,
      result,
      "Customers fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const updateCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.params.id as string;

    const customer =
      await customerService.updateCustomer(
        customerId,
        req.user!,
        req.body
      );

    return successResponse(
      res,
      customer,
      "Customer updated successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const deleteCustomerHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.params.id as string;

    const result =
      await customerService.deleteCustomer(
        customerId,
        req.user!
      );

    return successResponse(
      res,
      result,
      "Customer deleted successfully"
    );
  } catch (err) {
    next(err);
  }
};