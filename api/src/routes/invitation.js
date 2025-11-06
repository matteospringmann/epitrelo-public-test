import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createInvitation,
  acceptInvitation,
} from "../controllers/invitationController.js";

const router = Router();
router.use(requireAuth);

router.post("/boards/:boardId/invitations", createInvitation);
router.post("/invitations/:token/accept", acceptInvitation);

export default router;
