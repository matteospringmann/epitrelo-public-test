import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  addToFavorites,
  removeFromFavorites,
  getFavoriteBoards,
} from "../controllers/boardController.js";

const router = Router();
router.use(requireAuth);

router.get("/", getBoards);
router.get("/favorites", getFavoriteBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.post("/:id/favorite", addToFavorites);
router.delete("/:id/favorite", removeFromFavorites);

export default router;
