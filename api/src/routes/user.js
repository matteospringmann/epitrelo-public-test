// api/src/routes/user.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  updateUserProfile,
  getUserStats,
  deleteUserAccount,
  updateUserTheme,
} from "../controllers/userController.js";

const router = Router();
router.use(requireAuth);

router.put("/profile", updateUserProfile);
router.get("/stats", getUserStats);
router.delete("/account", deleteUserAccount);
router.put("/theme", updateUserTheme); // Nouvelle route

export default router;
