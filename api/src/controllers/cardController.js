import { PrismaClient } from "@prisma/client";
import { sendAssignmentNotification } from "../services/emailService.js";
const prisma = new PrismaClient();

const checkCardAccess = (cardId, userId) => {
  return prisma.card.findFirst({
    where: {
      id: Number(cardId),
      list: {
        board: {
          OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
        },
      },
    },
  });
};

export async function createCard(req, res) {
  const { title, content, listId, deadline } = req.body;
  if (!title || !listId) {
    return res
      .status(400)
      .json({ error: "Le titre et l'ID de la liste sont requis" });
  }
  try {
    const list = await prisma.list.findFirst({
      where: {
        id: Number(listId),
        board: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { id: req.user.id } } },
          ],
        },
      },
    });

    if (!list) {
      return res
        .status(404)
        .json({ error: "Liste non trouvée ou accès non autorisé" });
    }
    const card = await prisma.card.create({
      data: {
        title,
        content,
        listId: Number(listId),
        deadline: deadline ? new Date(deadline) : null,
      },
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: "Impossible de créer la carte" });
  }
}

export async function updateCard(req, res) {
  const { id } = req.params;
  const { deadline, assignedUserId, ...dataToUpdate } = req.body;

  if (deadline !== undefined) {
    dataToUpdate.deadline = deadline ? new Date(deadline) : null;
  }
  if (assignedUserId !== undefined) {
    dataToUpdate.assignedUserId = assignedUserId;
  }

  try {
    // 1. Récupérer l'état actuel de la carte AVANT la mise à jour
    const cardBeforeUpdate = await prisma.card.findUnique({
      where: { id: Number(id) },
      select: {
        assignedUserId: true,
        list: { select: { board: true } }, // On récupère le board pour le nom
      },
    });

    if (!cardBeforeUpdate) {
      return res.status(404).json({ error: "Carte non trouvée." });
    }

    // 2. Mettre à jour la carte
    const updatedCard = await prisma.card.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      include: {
        labels: true,
        assignedUser: {
          // S'assurer d'inclure les infos de l'utilisateur assigné
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // 3. Logique de notification
    const oldAssignedId = cardBeforeUpdate.assignedUserId;
    const newAssignedUser = updatedCard.assignedUser;

    if (newAssignedUser && newAssignedUser.id !== oldAssignedId) {
      // Un nouvel utilisateur a été assigné (ou un utilisateur a été assigné là où il n'y en avait pas)
      const board = cardBeforeUpdate.list.board;
      sendAssignmentNotification(newAssignedUser, updatedCard, board);
    }

    res.json(updatedCard);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la carte" });
  }
}

export async function deleteCard(req, res) {
  const { id } = req.params;
  try {
    const cardToDelete = await checkCardAccess(id, req.user.id);
    if (!cardToDelete) {
      return res
        .status(404)
        .json({ error: "Carte non trouvée ou accès non autorisé" });
    }
    await prisma.card.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
