// api/src/controllers/labelController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createLabel(req, res) {
  const { name, color, boardId } = req.body;
  if (!name || !color || !boardId) {
    return res
      .status(400)
      .json({ error: "Nom, couleur et ID du board sont requis." });
  }

  const board = await prisma.board.findFirst({
    where: {
      id: Number(boardId),
      OR: [
        { ownerId: req.user.id },
        { members: { some: { id: req.user.id } } },
      ],
    },
  });

  if (!board) {
    return res
      .status(404)
      .json({ error: "Board non trouvé ou accès non autorisé." });
  }

  const label = await prisma.label.create({
    data: { name, color, boardId: Number(boardId) },
  });
  res.status(201).json(label);
}

export async function updateLabel(req, res) {
  const { id } = req.params;
  const { name, color } = req.body;
  try {
    const labelToUpdate = await prisma.label.findFirst({
      where: {
        id: Number(id),
        board: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { id: req.user.id } } },
          ],
        },
      },
    });
    if (!labelToUpdate) {
      return res
        .status(404)
        .json({ error: "Étiquette non trouvée ou accès non autorisé." });
    }
    const updatedLabel = await prisma.label.update({
      where: { id: Number(id) },
      data: { name, color },
    });
    res.json(updatedLabel);
  } catch (error) {
    res.status(500).json({ error: "Impossible de mettre à jour l'étiquette." });
  }
}

export async function deleteLabel(req, res) {
  const { id } = req.params;
  try {
    const labelToDelete = await prisma.label.findFirst({
      where: {
        id: Number(id),
        board: {
          OR: [
            { ownerId: req.user.id },
            { members: { some: { id: req.user.id } } },
          ],
        },
      },
    });
    if (!labelToDelete) {
      return res
        .status(404)
        .json({ error: "Étiquette non trouvée ou accès non autorisé." });
    }
    await prisma.label.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Impossible de supprimer l'étiquette." });
  }
}

// Associer une étiquette à une carte
export async function assignLabelToCard(req, res) {
  const { cardId, labelId } = req.params;

  const card = await prisma.card.update({
    where: { id: Number(cardId) },
    data: {
      labels: {
        connect: { id: Number(labelId) },
      },
    },
    include: { labels: true },
  });
  res.json(card);
}

// Retirer une étiquette d'une carte
export async function removeLabelFromCard(req, res) {
  const { cardId, labelId } = req.params;

  const card = await prisma.card.update({
    where: { id: Number(cardId) },
    data: {
      labels: {
        disconnect: { id: Number(labelId) },
      },
    },
    include: { labels: true },
  });
  res.json(card);
}
