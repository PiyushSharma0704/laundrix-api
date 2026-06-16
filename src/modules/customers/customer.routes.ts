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

const router = Router();

router.use(authenticate);

router.post("/", validate(createCustomerSchema), createCustomerHandler);
router.get("/", getCustomersHandler);
router.get("/:id", getCustomerHandler);
router.patch("/:id", validate(updateCustomerSchema), updateCustomerHandler);
router.delete("/:id", deleteCustomerHandler);


export default router;