import { Router } from "express";
import { testMiddleWare } from "../controllers/testmiddleware";

const router = Router();

router.get("/try-middleware", testMiddleWare)

export default router