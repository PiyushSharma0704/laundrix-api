import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { validate } from "@/middleware/validate.middleware";

import { UserRole } from "@prisma/client";

import {
  createServiceCatalogItem,
  getServiceCatalogItems,
  getServiceCatalogItem,
  getActiveServiceCatalogItems,
  updateServiceCatalogItem,
  updateServiceCatalogItemStatus,
} from "./service-catalog-item.controller";

import {
  createServiceCatalogItemSchema,
  updateServiceCatalogItemSchema,
  updateServiceCatalogItemStatusSchema,
  serviceCatalogItemQuerySchema,
} from "./service-catalog-item.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(createServiceCatalogItemSchema),
  createServiceCatalogItem,
);

router.get(
  "/",
  validate(serviceCatalogItemQuerySchema),
  getServiceCatalogItems,
);

router.get(
  "/active",
  getActiveServiceCatalogItems,
);

router.get(
  "/:id",
  getServiceCatalogItem,
);

router.patch(
  "/:id",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(updateServiceCatalogItemSchema),
  updateServiceCatalogItem,
);

router.patch(
  "/:id/status",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.PLATFORM_ADMIN,
    UserRole.STORE_MANAGER,
  ),
  validate(updateServiceCatalogItemStatusSchema),
  updateServiceCatalogItemStatus,
);

export default router;