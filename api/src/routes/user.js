// api/src/routes/user.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  updateUserProfile,
  getUserStats,
  deleteUserAccount,
} from "../controllers/userController.js";

const router = Router();
router.use(requireAuth);

router.put("/profile", updateUserProfile);
router.get("/stats", getUserStats);
router.delete("/account", deleteUserAccount);

export default router;
