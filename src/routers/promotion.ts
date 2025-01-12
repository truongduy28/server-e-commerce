import { Router } from "express";
import * as promotionControllers from "../controllers/promotion";
import { verify } from "crypto";
const router = Router();

router.get("/", promotionControllers.getPromotions);

router.post("/add", promotionControllers.addNew);
router.get("/:id", promotionControllers.getPromotion);
router.put("/update/:id", promotionControllers.updatePromotion);

export default router;
