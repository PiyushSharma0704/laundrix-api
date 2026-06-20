// src/modules/stores/store.validation.ts
import { z } from "zod";

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100),

    slug: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9-]+$/),

    code: z.string().trim().min(2).max(20),

    phone: z.string().trim().optional(),

    email: z.string().email().optional(),

    address: z.string().trim().max(500).optional(),
  }),
});

export const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).max(100).optional(),

    slug: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9-]+$/)
      .optional(),

    code: z.string().trim().min(2).max(20).optional(),

    phone: z.string().trim().optional(),

    email: z.string().email().optional(),

    address: z.string().trim().max(500).optional(),

    isActive: z.boolean().optional(),
  }),
});
