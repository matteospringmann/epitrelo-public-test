// api/src/routes/auth.js (Version Corrigée et Unifiée)

import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken"; // <-- Importer JWT
import { register, login, me, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const setJwtCookie = (res, user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });
};

router.post("/register", (req, res, next) => {
  register(req, res, next);
});

router.post("/login", login);

router.get("/me", requireAuth, me);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    setJwtCookie(res, req.user);
    res.redirect("http://localhost:5173/boards");
  },
);

export default router;
