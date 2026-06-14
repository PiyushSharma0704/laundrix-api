// src/modules/stores/store.types.ts
import { z } from "zod";
import { createStoreSchema } from "./store.validation";

export type CreateStoreDto = z.infer<typeof createStoreSchema>["body"];
