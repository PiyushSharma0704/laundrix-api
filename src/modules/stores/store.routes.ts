// src/modules/stores/store.routes.ts
import { Router } from "express";
import * as storeController from "./store.controller";
import { validate } from "../../middleware/validate.middleware";
import { createStoreSchema } from "./store.validation";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/create",
  authorize("SUPER_ADMIN", "OWNER"),
  validate(createStoreSchema),
  storeController.createStore,
);

router.get("/my-stores", storeController.getMyStores);

router.get("/:id", storeController.getStoreById);

export default router;