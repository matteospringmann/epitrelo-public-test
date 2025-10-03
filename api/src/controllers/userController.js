// api/src/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Mettre à jour le nom de l'utilisateur
export async function updateUserProfile(req, res) {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Le nom est requis" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    const { passwordHash, ...user } = updatedUser;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
}

// Récupérer les statistiques de l'utilisateur
export async function getUserStats(req, res) {
  const userId = req.user.id;
  try {
    const boardCount = await prisma.board.count({
      where: { userId },
    });

    const listCount = await prisma.list.count({
      where: { board: { userId } },
    });

    const cardCount = await prisma.card.count({
      where: { list: { board: { userId } } },
    });

    res.json({ boardCount, listCount, cardCount });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des statistiques" });
  }
}

// Supprimer le compte de l'utilisateur
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
