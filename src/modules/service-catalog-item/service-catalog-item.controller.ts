import { Request, Response, NextFunction } from "express";

import { AuthRequest } from "@/types/auth-request";
import { successResponse } from "@/utils/response";

import * as serviceCatalogItemService from "./service-catalog-item.service";

export const createServiceCatalogItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogItem =
      await serviceCatalogItemService.createServiceCatalogItem(
        req.user!,
        req.body,
      );

    return successResponse(
      res,
      serviceCatalogItem,
      "Service catalog item created successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const getServiceCatalogItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogItems =
      await serviceCatalogItemService.getServiceCatalogItems(req.query);

    return successResponse(
      res,
      serviceCatalogItems,
      "Service catalog items fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getServiceCatalogItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogId = req.params.id as string;
    const serviceCatalogItem =
      await serviceCatalogItemService.getServiceCatalogItem(serviceCatalogId);

    return successResponse(
      res,
      serviceCatalogItem,
      "Service catalog item fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const getActiveServiceCatalogItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogItems =
      await serviceCatalogItemService.getActiveServiceCatalogItems();

    return successResponse(
      res,
      serviceCatalogItems,
      "Active service catalog items fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateServiceCatalogItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogId = req.params.id as string;
    const serviceCatalogItem =
      await serviceCatalogItemService.updateServiceCatalogItem(
        serviceCatalogId,
        req.user!,
        req.body,
      );

    return successResponse(
      res,
      serviceCatalogItem,
      "Service catalog item updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

export const updateServiceCatalogItemStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceCatalogId = req.params.id as string;
    const serviceCatalogItem =
      await serviceCatalogItemService.updateServiceCatalogItemStatus(
        serviceCatalogId,
        req.user!,
        req.body.isActive,
      );

    return successResponse(
      res,
      serviceCatalogItem,
      "Service catalog item status updated successfully",
    );
  } catch (error) {
    next(error);
  }
};
