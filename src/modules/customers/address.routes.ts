// src/modules/customers/address.routes.ts

import { Router } from "express";
import {
  createAddressHandler,
  getAddressesHandler,
  getAddressHandler,
  updateAddressHandler,
  deleteAddressHandler,
} from "./address.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/:customerId/addresses",
  validate(createAddressSchema),
  createAddressHandler,
);

router.get(
  "/:customerId/addresses",
  getAddressesHandler,
);

router.get(
  "/:customerId/addresses/:addressId",
  getAddressHandler,
);

router.patch(
  "/:customerId/addresses/:addressId",
  validate(updateAddressSchema),
  updateAddressHandler,
);

router.delete(
  "/:customerId/addresses/:addressId",
  deleteAddressHandler,
);

export default router;