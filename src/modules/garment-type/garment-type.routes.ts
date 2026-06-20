import { Router } from "express";
import { validate } from "@/middleware/validate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { UserRole } from "@prisma/client";
import {
  createGarmentType,
  getGarmentTypes,
  getGarmentType,
  getActiveGarmentTypes,
  updateGarmentType,
  updateGarmentTypeStatus,
} from "./garment-type.controller";

import {
  createGarmentTypeSchema,
  updateGarmentTypeSchema,
  updateGarmentTypeStatusSchema,
  garmentTypeQuerySchema,
} from "./garment-type.validation";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();
router.use(authenticate);


router.post(
  "/",
  authorize(UserRole.BUSINESS_OWNER, UserRole.PLATFORM_ADMIN, UserRole.STORE_MANAGER),
  validate(createGarmentTypeSchema),
  createGarmentType,
);

router.get(
  "/",
  validate(garmentTypeQuerySchema),
  getGarmentTypes,
);

router.get(
  "/active",
  getActiveGarmentTypes,
);

router.get(
  "/:id",
  getGarmentType,
);

router.patch(
  "/:id",
  authorize(UserRole.BUSINESS_OWNER, UserRole.PLATFORM_ADMIN, UserRole.STORE_MANAGER),
  validate(updateGarmentTypeSchema),
  updateGarmentType,
);

router.patch(
  "/:id/status",
  authorize(UserRole.BUSINESS_OWNER, UserRole.PLATFORM_ADMIN, UserRole.STORE_MANAGER),
  validate(updateGarmentTypeStatusSchema),
  updateGarmentTypeStatus,
);

export default router;