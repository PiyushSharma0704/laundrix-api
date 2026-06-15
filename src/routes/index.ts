import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import storeRoutes from "@/modules/stores/store.routes";
import customerRoutes from "@/modules/customers/customer.routes";
import businessesRoutes from "@/modules/businesses/business.routes";
import addressRoutes from "@/modules/customers/address.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/stores", storeRoutes);
router.use("/customers", customerRoutes);
router.use("/businesses", businessesRoutes);
router.use("/customers", addressRoutes);


export default router;
