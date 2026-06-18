// src/modules/stores/store.types.ts

import { z } from "zod";
import { createStoreSchema, updateStoreSchema } from "./store.validation";

export type CreateStoreDto = z.infer<typeof createStoreSchema>["body"];
export type UpdateStoreDto = z.infer<typeof updateStoreSchema>["body"];