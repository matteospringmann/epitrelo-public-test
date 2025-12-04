// api/src/controllers/authController.js (Version Corrigée)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const setCookie = (res, token) =>
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  setCookie(res, token);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  if (!user.passwordHash) {
    return res.status(401).json({
      error:
        "Ce compte a été créé avec Google. Veuillez vous connecter avec Google.",
    });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  setCookie(res, token);
  res.json({ id: user.id, name: user.name, email: user.email });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, avatarUrl: true, theme: true, createdAt: true },
  });
  res.json(user); // Retourne directement l'utilisateur, pas { user: ... }
}
export async function logout(_req, res) {
  res.clearCookie("token");
  res.json({ ok: true });
}
