import { Router } from "express";
import * as customerControllers from "../controllers/customer";
const router = Router();

router.post("/sign-up", customerControllers.create);
router.post("/verify-code", customerControllers.verifyCode);
router.post("/resend-code", customerControllers.resendCode);
router.post("/login", customerControllers.login);

export default router;
