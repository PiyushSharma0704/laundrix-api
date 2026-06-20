import { Request, Response } from "express";

import {
  createGarmentTypeService,
  getGarmentTypesService,
  getGarmentTypeService,
  getActiveGarmentTypesService,
  updateGarmentTypeService,
  updateGarmentTypeStatusService,
} from "./garment-type.service";

import { AuthRequest } from "@/types/auth-request";
import { successResponse } from "@/utils/response";

export const createGarmentType = async (req: AuthRequest, res: Response) => {
  const garmentType = await createGarmentTypeService(req.user!, req.body);

  res.status(201).json({
    success: true,
    message: "Garment type created successfully",
    data: garmentType,
  });
};

export const getGarmentTypes = async (req: Request, res: Response) => {
  const garmentTypes = await getGarmentTypesService(req.query);

  res.status(200).json({
    success: true,
    data: garmentTypes,
  });
};

export const getGarmentType = async (req: Request, res: Response) => {
  const garmentId = req.params.id as string;;
  const garmentType = await getGarmentTypeService(garmentId);

  return successResponse(
    res,
    garmentType,
    "Garment type fetched successfully",
    200,
  );
};

export const getActiveGarmentTypes = async (req: Request, res: Response) => {
  const garmentTypes = await getActiveGarmentTypesService();

  return successResponse(
    res,
    garmentTypes,
    "Active garment types fetched successfully",
    200,
  );
};

export const updateGarmentType = async (req: AuthRequest, res: Response) => {
  const garmentId = req.params.id as string;;
  const garmentType = await updateGarmentTypeService(
    garmentId,
    req.user!,
    req.body,
  );

  return successResponse(
    res,
    garmentType,
    "Updated garment type successfully",
    200,
  );
};

export const updateGarmentTypeStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  const garmentId = req.params.id as string;;
  const garmentType = await updateGarmentTypeStatusService(
    garmentId,
    req.user!,
    req.body.isActive,
  );
  return successResponse(
    res,
    garmentType,
    "Garment type status updated successfully",
    200,
  );
};
