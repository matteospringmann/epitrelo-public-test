// api/src/routes/board.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
} from "../controllers/boardController.js";

const router = Router();
router.use(requireAuth);

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);
router.delete("/:id", deleteBoard);

export default router;
