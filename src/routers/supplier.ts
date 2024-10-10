import { Router } from "express";
import * as supplierControllers from "../controllers/supplier";

const router = Router();

router.post("/add-new", supplierControllers.addNew);
router.get("/", supplierControllers.getSuppliers);
export default router;
