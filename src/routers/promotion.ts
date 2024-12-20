import { Router } from "express";
import * as promotionControllers from "../controllers/promotion";
const router = Router();

router.post("/add", promotionControllers.addNew);
router.get("/", promotionControllers.getPromotions);
router.get("/:id", promotionControllers.getPromotion);
router.put("/update/:id", promotionControllers.updatePromotion);

export default router;
