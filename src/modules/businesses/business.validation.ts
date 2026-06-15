// business.validation.ts

import { z } from "zod";

export const createBusinessSchema = z.object({
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