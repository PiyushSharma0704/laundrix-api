import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import storeRoutes from "@/modules/stores/store.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/stores", storeRoutes);

export default router;
