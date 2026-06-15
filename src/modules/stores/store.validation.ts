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

  }),
});
