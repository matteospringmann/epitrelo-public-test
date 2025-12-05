// api/src/routes/user.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  updateUserProfile,
  getUserStats,
  deleteUserAccount,
  updateUserTheme,
  linkGoogleAccount,
  unlinkGoogleAccount,
  setPassword,
} from "../controllers/userController.js";

const router = Router();
router.use(requireAuth);

router.put("/profile", updateUserProfile);
router.get("/stats", getUserStats);
router.delete("/account", deleteUserAccount);
router.put("/theme", updateUserTheme);
router.post("/link-google", linkGoogleAccount);
router.delete("/unlink-google", unlinkGoogleAccount);
router.post("/set-password", setPassword);

export default router;
