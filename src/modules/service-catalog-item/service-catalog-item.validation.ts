import { PricingUnit } from "@prisma/client";
import { z } from "zod";

export const createServiceCatalogItemSchema = z.object({
  body: z.object({
    serviceTypeId: z.uuid("Service Type ID must be a valid UUID"),

    garmentTypeId: z.uuid("Garment Type ID must be a valid UUID"),

    code: z
      .string()
      .trim()
      .max(50, "Code cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    pricingUnit: z.enum(PricingUnit, {
      message: "Invalid pricing unit",
    }),

    basePrice: z
      .number()
      .positive("Base price must be greater than 0"),

    minimumPrice: z
      .number()
      .nonnegative("Minimum price cannot be negative")
      .optional(),

    gstRate: z
      .number()
      .min(0, "GST rate cannot be negative")
      .max(100, "GST rate cannot exceed 100")
      .optional(),
  }),
});

export const updateServiceCatalogItemSchema = z.object({
  body: z.object({
    serviceTypeId: z
      .uuid("Service Type ID must be a valid UUID")
      .optional(),

    garmentTypeId: z
      .uuid("Garment Type ID must be a valid UUID")
      .optional(),

    code: z
      .string()
      .trim()
      .max(50, "Code cannot exceed 50 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    pricingUnit: z
      .enum(PricingUnit, {
        message: "Invalid pricing unit",
      })
      .optional(),

    basePrice: z
      .number()
      .positive("Base price must be greater than 0")
      .optional(),

    minimumPrice: z
      .number()
      .nonnegative("Minimum price cannot be negative")
      .optional(),

    gstRate: z
      .number()
      .min(0, "GST rate cannot be negative")
      .max(100, "GST rate cannot exceed 100")
      .optional(),
  }),
});

export const updateServiceCatalogItemStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const serviceCatalogItemQuerySchema = z.object({
  query: z.object({
    serviceTypeId: z.uuid().optional(),

    garmentTypeId: z.uuid().optional(),

    pricingUnit: z
      .enum(PricingUnit)
      .optional(),

    isActive: z
      .enum(["true", "false"])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === "true",
      ),

    search: z.string().trim().optional(),
  }),
});