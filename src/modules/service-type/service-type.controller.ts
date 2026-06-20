import { Response, NextFunction, Request } from "express";

import { AuthRequest } from "@/types/auth-request";
import { successResponse } from "@/utils/response";
import * as serviceTypeService from "./service-type.service";



export const createServiceType = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceType =
      await serviceTypeService.createServiceType(
        req.user!,
        req.body,
      );

    return successResponse(
      res,
      serviceType,
      "Service type created successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getServiceTypes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceTypes =
      await serviceTypeService.getServiceTypes(req.query);

    return successResponse(
      res,
      serviceTypes,
      "Service types fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getServiceType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceId = req.params.id as string;
    const serviceType =
      await serviceTypeService.getServiceType(
        serviceId,
      );

    return successResponse(
      res,
      serviceType,
      "Service type fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getActiveServiceTypes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceTypes =
      await serviceTypeService.getActiveServiceTypes();

    return successResponse(
      res,
      serviceTypes,
      "Active service types fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateServiceType = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceId = req.params.id as string;

    const serviceType =
      await serviceTypeService.updateServiceType(
        serviceId,
        req.user!,
        req.body,
      );

    return successResponse(
      res,
      serviceType,
      "Service type updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateServiceTypeStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceId = req.params.id as string;

    const serviceType =
      await serviceTypeService.updateServiceTypeStatus(
        serviceId,
        req.user!,
        req.body.isActive,
      );

    return successResponse(
      res,
      serviceType,
      "Service type status updated successfully",
    );
  } catch (error) {
    next(error);
  }
};