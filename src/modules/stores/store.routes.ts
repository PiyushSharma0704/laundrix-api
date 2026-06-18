import { Router } from "express";
import { UserRole } from "@prisma/client";

import * as storeController from "./store.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  createStoreSchema,
  updateStoreSchema,
} from "./store.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/create",
  authorize(
    UserRole.PLATFORM_SUPER_ADMIN,
    UserRole.BUSINESS_OWNER
  ),
  validate(createStoreSchema),
  storeController.createStore
);

router.get(
  "/my-stores",
  storeController.getMyStores
);

router.get(
  "/:id",
  storeController.getStoreById
);

router.patch(
  "/:id",
  authorize(
    UserRole.PLATFORM_SUPER_ADMIN,
    UserRole.BUSINESS_OWNER
  ),
  validate(updateStoreSchema),
  storeController.updateStore
);

router.delete(
  "/:id",
  authorize(
    UserRole.PLATFORM_SUPER_ADMIN,
    UserRole.BUSINESS_OWNER
  ),
  storeController.deleteStore
);

export default router;