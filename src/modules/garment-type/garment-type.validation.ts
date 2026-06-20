import { z } from "zod";

export const createGarmentTypeSchema = z.object({
  body: z.object({
    categoryId: z.uuid("Category ID must be a valid UUID"),

    code: z
      .string()
      .trim()
      .max(50, "Code cannot exceed 50 characters")
      .optional(),

    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    imageUrl: z.url("Image URL must be a valid URL").optional(),

    sortOrder: z
      .number()
      .int("Sort order must be an integer")
      .min(0, "Sort order cannot be negative")
      .optional(),
  }),
});

export const updateGarmentTypeSchema = z.object({
  body: z.object({
    categoryId: z.uuid("Category ID must be a valid UUID").optional(),

    code: z
      .string()
      .trim()
      .max(50, "Code cannot exceed 50 characters")
      .optional(),

    name: z
      .string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    imageUrl: z.url("Image URL must be a valid URL").optional(),

    sortOrder: z
      .number()
      .int("Sort order must be an integer")
      .min(0, "Sort order cannot be negative")
      .optional(),
  }),
});

export const updateGarmentTypeStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const garmentTypeQuerySchema = z.object({
  query: z.object({
    categoryId: z.uuid().optional(),

    search: z.string().trim().optional(),

    isActive: z
      .enum(["true", "false"])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === "true",
      ),
  }),
});