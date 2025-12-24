import { Router } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { authController } from "./auth.container";
import { validate } from "@/shared/middlewares/validate.middleware";
import { authenticate } from "@/shared/middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);

export default router;
