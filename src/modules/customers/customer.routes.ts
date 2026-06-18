// src/modules/customers/customer.routes.ts

import { Router } from "express";
import {
  createCustomerHandler,
  getCustomerHandler,
  getCustomersHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
} from "./customer.controller";
import { createCustomerSchema, updateCustomerSchema } from "./customer.validation";
import { validate } from "@/middleware/validate.middleware";
import { authenticate } from "@/middleware/auth.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.STORE_MANAGER,
    UserRole.CASHIER
  ),
  validate(createCustomerSchema),
  createCustomerHandler
);

router.get("/", getCustomersHandler);

router.get("/:id", getCustomerHandler);

router.patch(
  "/:id",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.STORE_MANAGER
  ),
  validate(updateCustomerSchema),
  updateCustomerHandler
);

router.delete(
  "/:id",
  authorize(
    UserRole.BUSINESS_OWNER,
    UserRole.STORE_MANAGER
  ),
  deleteCustomerHandler
);


export default router;