import { Router } from "express";
import * as productControllers from '../controllers/product';
const router = Router();

router.post("/add-new", productControllers.addProduct)

export default router