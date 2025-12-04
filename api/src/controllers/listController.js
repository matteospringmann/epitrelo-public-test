// api/src/controllers/listController.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createList(req, res) {
  const { title, boardId } = req.body;
  if (!title || !boardId) {
    return res
      .status(400)
      .json({ error: "Le titre et l'ID du board sont requis" });
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
      .json({ error: "Board non trouvé ou accès non autorisé" });
  }

  const list = await prisma.list.create({
    data: { title, boardId: Number(boardId) },
  });
  res.status(201).json(list);
}

export async function updateList(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  
  if (!title?.trim()) {
    return res.status(400).json({ error: "Le titre est requis" });
  }

  try {
    // Vérifier que l'utilisateur a accès à cette liste
    const list = await prisma.list.findFirst({
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

    if (!list) {
      return res.status(404).json({ error: "Liste non trouvée ou accès non autorisé" });
    }

    const updatedList = await prisma.list.update({
      where: { id: Number(id) },
      data: { title: title.trim() },
    });

    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ error: "Impossible de mettre à jour la liste" });
  }
}

export async function deleteList(req, res) {
  const { id } = req.params;

  try {
    const list = await prisma.list.findFirst({
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

    if (!list) {
      return res.status(404).json({ error: "Liste non trouvée ou accès non autorisé" });
    }

    await prisma.list.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Impossible de supprimer la liste" });
  }
}
