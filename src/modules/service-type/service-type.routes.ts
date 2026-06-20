import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { validate } from "@/middleware/validate.middleware";

import { UserRole } from "@prisma/client";

import {
  createServiceType,
  getServiceTypes,
  getServiceType,
  getActiveServiceTypes,
  updateServiceType,
  updateServiceTypeStatus,
} from "./service-type.controller";

import {
  createServiceTypeSchema,
  updateServiceTypeSchema,
  updateServiceTypeStatusSchema,
  serviceTypeQuerySchema,
} from "./service-type.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(createServiceTypeSchema),
  createServiceType,
);

router.get(
  "/",
  validate(serviceTypeQuerySchema),
  getServiceTypes,
);

router.get(
  "/active",
  getActiveServiceTypes,
);

router.get(
  "/:id",
  getServiceType,
);

router.patch(
  "/:id",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(updateServiceTypeSchema),
  updateServiceType,
);

router.patch(
  "/:id/status",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(updateServiceTypeStatusSchema),
  updateServiceTypeStatus,
);

export default router;