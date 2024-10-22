import { Router } from "express";
import * as categoryControllers from '../controllers/category';

const router = Router()

router.post("/add-new", categoryControllers.addCategory)
router.get("/", categoryControllers.getCategories)
router.delete("/delete", categoryControllers.deleteCategories)
router.put("/update", categoryControllers.updateCategory)

export default router