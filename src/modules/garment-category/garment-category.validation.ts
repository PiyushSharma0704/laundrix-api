import { z } from "zod";

export const createGarmentCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

export const updateGarmentCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateGarmentCategoryStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getGarmentCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});