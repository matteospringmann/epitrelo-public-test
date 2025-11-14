import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";

const router = Router();
router.use(requireAuth);

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
