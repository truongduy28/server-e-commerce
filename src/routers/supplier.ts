import { Router } from "express";
import * as supplierControllers from "../controllers/supplier";

const router = Router();

router.get("/", supplierControllers.getSuppliers);
router.put("/update", supplierControllers.update);
router.post("/add-new", supplierControllers.addNew);
export default router;
