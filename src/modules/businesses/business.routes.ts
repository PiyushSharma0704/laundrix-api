// src/modules/businesses/business.routes.ts
import { Router } from "express";
import * as businessController from "./business.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/authorize.middleware";
import { validate } from "../../middleware/validate.middleware";

import { createBusinessSchema } from "./business.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/create",
  authorize("PLATFORM_SUPER_ADMIN"),
  validate(createBusinessSchema),
  businessController.createBusiness,
);

router.get(
  "/my-business",
  businessController.getMyBusiness,
);

router.get(
  "/:id",
  businessController.getBusinessById,
);

export default router;