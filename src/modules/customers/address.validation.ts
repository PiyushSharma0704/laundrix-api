import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().max(50).optional(),

    buildingName: z.string().max(255).optional(),

    landmark: z.string().max(255).optional(),

    locality: z.string().max(255).optional(),

    city: z.string().max(100).optional(),

    state: z.string().max(100).optional(),

    pincode: z.string().max(20).optional(),

    countryCode: z.string().max(10).optional(),

    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = createAddressSchema;