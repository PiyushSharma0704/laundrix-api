// auth.routes.ts
import { Router } from "express";
import * as authController from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware"; // instead of @/middleware/...
import { validate } from "../../middleware/validate.middleware";

import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Laundrix API Working",
  });
});

router.post("/refresh", validate(refreshSchema), authController.refresh);

router.get("/me", authMiddleware, authController.me);

router.post("/logout", authMiddleware, authController.logout);

router.post("/change-password", authMiddleware, validate(changePasswordSchema), authController.changePassword);

export default router;
