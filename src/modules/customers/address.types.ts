
// src/modules/customers/address.types.ts
import { z } from "zod";

import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation";

export type CreateAddressDto =
  z.infer<typeof createAddressSchema>["body"];

export type UpdateAddressDto =
  z.infer<typeof updateAddressSchema>["body"];