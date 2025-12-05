// api/src/controllers/userController.js (Entièrement Corrigé)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Mettre à jour le profil utilisateur
export async function updateUserProfile(req, res) {
  const { name, bio, location, website, avatarUrl, emailNotifications } = req.body;
  const userId = req.user.id;

  try {
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (location !== undefined) dataToUpdate.location = location;
    if (website !== undefined) dataToUpdate.website = website;
    if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;
    if (emailNotifications !== undefined) dataToUpdate.emailNotifications = emailNotifications;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        theme: true,
        bio: true,
        location: true,
        website: true,
        emailNotifications: true,
        googleId: true,
        createdAt: true,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
}

// Lier un compte Google existant
export async function linkGoogleAccount(req, res) {
  const { googleId } = req.body;
  const userId = req.user.id;

  if (!googleId) {
    return res.status(400).json({ error: "Google ID requis" });
  }

  try {
    // Vérifier que ce Google ID n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { googleId },
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: "Ce compte Google est déjà lié à un autre utilisateur" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { googleId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        theme: true,
        googleId: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la liaison du compte Google" });
  }
}

// Délier le compte Google
export async function unlinkGoogleAccount(req, res) {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.passwordHash) {
      return res.status(400).json({
        error: "Vous devez d'abord définir un mot de passe avant de délier votre compte Google",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { googleId: null },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        theme: true,
        googleId: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de la liaison Google" });
  }
}

// Définir un mot de passe pour les comptes Google
export async function setPassword(req, res) {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  try {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    res.json({ message: "Mot de passe défini avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la définition du mot de passe" });
  }
}

export async function updateUserTheme(req, res) {
  const { theme } = req.body;

  if (!theme || !["light", "dark"].includes(theme)) {
    return res.status(400).json({ error: "Le thème doit être 'light' ou 'dark'" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { theme },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        theme: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du thème" });
  }
}

export async function getUserStats(req, res) {
  const userId = req.user.id;

  try {
    const boardCount = await prisma.board.count({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
    });

    const listCount = await prisma.list.count({
      where: {
        board: {
          OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
        },
      },
    });

    const cardCount = await prisma.card.count({
      where: {
        OR: [
          { assignedUserId: userId },
          {
            list: {
              board: {
                OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
              },
            },
          },
        ],
      },
    });

    const commentCount = await prisma.comment.count({
      where: { userId },
    });

    res.json({ boardCount, listCount, cardCount, commentCount });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
}

export async function deleteUserAccount(req, res) {
  const userId = req.user.id;
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.clearCookie("token").status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du compte" });
  }
}
