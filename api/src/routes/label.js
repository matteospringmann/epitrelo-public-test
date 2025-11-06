import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createLabel,
  updateLabel,
  deleteLabel,
  assignLabelToCard,
  removeLabelFromCard,
} from "../controllers/labelController.js";

const router = Router();
router.use(requireAuth);

router.post("/", createLabel);
router.put("/:id", updateLabel);
router.delete("/:id", deleteLabel);

router.post("/:labelId/card/:cardId", assignLabelToCard);
router.delete("/:labelId/card/:cardId", removeLabelFromCard);

export default router;
