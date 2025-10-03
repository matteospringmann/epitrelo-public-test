import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createList } from "../controllers/listController.js";

const router = Router();
router.use(requireAuth);
router.post("/", createList);
export default router;
