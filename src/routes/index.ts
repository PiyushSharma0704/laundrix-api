import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import storeRoutes from "@/modules/stores/store.routes";
import customerRoutes from "@/modules/customers/customer.routes";
import businessesRoutes from "@/modules/businesses/business.routes";
import addressRoutes from "@/modules/customers/address.routes";
import getGarmentCategories from "@/modules/garment-category/garment-category.routes";
import getGarmentType from "@/modules/garment-type/garment-type.routes";
import getServiceTypes from "@/modules/service-type/service-type.routes";
import getServiceCatalog from "@/modules/service-catalog-item/service-catalog-item.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/stores", storeRoutes);
router.use("/customers", customerRoutes);
router.use("/businesses", businessesRoutes);
router.use("/customers", addressRoutes);
router.use("/garment-categories", getGarmentCategories);
router.use("/garment-types", getGarmentType);
router.use("/service-types", getServiceTypes);
router.use("/service-catalog-items", getServiceCatalog);

export default router;
