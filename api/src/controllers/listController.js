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
