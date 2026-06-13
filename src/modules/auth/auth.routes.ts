import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

router.post(
  "/register",
  authController.register
);

router.post("/login", authController.login);


router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Laundrix API Working",
  });
});


// router.post(
//   "/login",
//   authController.login
// );

// router.get(
//   "/me",
//   authMiddleware ,
//   authController.me
// );

export default router;