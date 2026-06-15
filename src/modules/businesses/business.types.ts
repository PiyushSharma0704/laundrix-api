// business.types.ts

import { z } from "zod";
import { createBusinessSchema } from "./business.validation";

export type CreateBusinessDto = z.infer<
  typeof createBusinessSchema
>["body"];