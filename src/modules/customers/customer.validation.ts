// src/modules/customers/customer.validation.ts
import { z } from "zod";

export const createCustomerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),

    lastName: z.string().optional(),

    phone: z.string().min(8),

    dialCode: z.string().default("+91"),

    email: z.string().email().optional(),

    notes: z.string().optional(),

    storeId: z.string().uuid(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),

    email: z.string().email().optional(),

    notes: z.string().optional(),

    isActive: z.boolean().optional(),
  }),
});