import { z } from "zod";

import {
  createGarmentCategorySchema,
  updateGarmentCategorySchema,
  updateGarmentCategoryStatusSchema,
} from "./garment-category.validation";

export type CreateGarmentCategoryDto =
  z.infer<typeof createGarmentCategorySchema>["body"];

export type UpdateGarmentCategoryDto =
  z.infer<typeof updateGarmentCategorySchema>["body"];

export type UpdateGarmentCategoryStatusDto =
  z.infer<typeof updateGarmentCategoryStatusSchema>["body"];