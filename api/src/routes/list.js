import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createList, updateList, deleteList } from "../controllers/listController.js";

const router = Router();
router.use(requireAuth);

router.post("/", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList); // Nouvelle route

export default router;
