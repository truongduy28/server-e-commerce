import { Router } from "express";
import * as supplierControllers from "../controllers/supplier";

const router = Router();

router.get("/", supplierControllers.getSuppliers);
router.put("/update", supplierControllers.update);
router.post("/add-new", supplierControllers.addNew);
router.post("/export-to-excel", supplierControllers.exportToExcel);
export default router;
