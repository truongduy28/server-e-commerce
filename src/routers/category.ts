import { Router } from "express";
import * as categoryControllers from '../controllers/category';

const router = Router()

router.post("/add-new", categoryControllers.addCategory)
router.get("/", categoryControllers.getCategories)

export default router