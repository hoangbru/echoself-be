import { Router } from "express";
import { validate } from "@/shared/middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.schema";
import { authController } from "./auth.container";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
