import { Router } from "express";
import * as productControllers from "../controllers/product";
const router = Router();

router.post("/add-new", productControllers.addProduct);
router.get("/", productControllers.getProducts);
router.get("/detail", productControllers.getProductDetail);
router.put("/update", productControllers.updateProduct);
router.delete("/delete", productControllers.removeProduct);

router.post("/add-sub-product", productControllers.addSubProduct);

export default router;
