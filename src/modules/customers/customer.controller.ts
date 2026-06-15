// src/modules/customers/customer.controller.ts

import { Request, Response, NextFunction } from "express";
import * as customerService from "./customer.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQuery,
} from "./customer.types";
import { successResponse } from "@/utils/response";

export const createCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateCustomerDto = req.body;

    const customer = await customerService.createCustomer(payload);

    return successResponse(res, customer, "Customer created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    const customer = await customerService.getCustomerById(id, storeId);

    return successResponse(res, customer, "Customer fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getCustomersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = req.query.storeId as string;

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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    const payload: UpdateCustomerDto = req.body;

    const customer = await customerService.updateCustomer(id, storeId, payload);

    return successResponse(res, customer, "Customer updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const storeId = req.query.storeId as string;

    const result = await customerService.deleteCustomer(id, storeId);

    return successResponse(res, result, "Customer deleted successfully");
  } catch (err) {
    next(err);
  }
};
