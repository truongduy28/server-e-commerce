import { Router } from "express";
import * as userControllers from "../controllers/user";

const router = Router();

router.post("/register", userControllers.register);

export default router;
