import { Router } from "express";

import { validate } from "@/middleware/validate.middleware";
import { authorize } from "@/middleware/authorize.middleware";

import { UserRole } from "@prisma/client";

import {
  createGarmentCategory,
  getGarmentCategories,
  getGarmentCategory,
  getActiveGarmentCategories,
  updateGarmentCategory,
  updateGarmentCategoryStatus,
} from "./garment-category.controller";

import {
  createGarmentCategorySchema,
  updateGarmentCategorySchema,
  updateGarmentCategoryStatusSchema,
  getGarmentCategorySchema,
} from "./garment-category.validation";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();
router.use(authenticate);

router.post(
  "/",
  authorize(UserRole.BUSINESS_OWNER),
  validate(createGarmentCategorySchema),
  createGarmentCategory,
);

router.get(
  "/",
  authorize(UserRole.BUSINESS_OWNER, UserRole.STORE_MANAGER, UserRole.CASHIER),
  getGarmentCategories,
);

router.get(
  "/active",
  authorize(UserRole.BUSINESS_OWNER, UserRole.STORE_MANAGER, UserRole.CASHIER),
  getActiveGarmentCategories,
);

router.get(
  "/:id",
  authorize(UserRole.BUSINESS_OWNER, UserRole.STORE_MANAGER, UserRole.CASHIER),
  validate(getGarmentCategorySchema),
  getGarmentCategory,
);

router.patch(
  "/:id",
  authorize(UserRole.BUSINESS_OWNER),
  validate(updateGarmentCategorySchema),
  updateGarmentCategory,
);

router.patch(
  "/:id/status",
  authorize(UserRole.BUSINESS_OWNER),
  validate(updateGarmentCategoryStatusSchema),
  updateGarmentCategoryStatus,
);

export default router;
