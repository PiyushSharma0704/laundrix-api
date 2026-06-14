// auth.routes.ts
import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware"; // instead of @/middleware/...
import { validate } from "../../middleware/validate.middleware";

import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", authController.refreshToken);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Laundrix API Working",
  });
});


router.get("/me", authenticate, authController.me);

router.post("/logout", authenticate, authController.logout);

router.post("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
