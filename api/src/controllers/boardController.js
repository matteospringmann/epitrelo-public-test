// api/src/controllers/boardController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getBoards(req, res) {
  const boards = await prisma.board.findMany({
    where: { userId: req.user.id },
  });
  res.json(boards);
}

export async function getBoardById(req, res) {
  const { id } = req.params;
  const board = await prisma.board.findUnique({
    where: { id: Number(id), userId: req.user.id },
    include: {
      lists: {
        orderBy: { id: "asc" },
        include: {
          cards: {
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  if (!board) {
    return res.status(404).json({ error: "Board non trouvé" });
  }
  res.json(board);
}

export async function createBoard(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Le titre est requis" });
  }
  const board = await prisma.board.create({
    data: {
      title,
      userId: req.user.id,
    },
  });
  res.status(201).json(board);
}

export async function deleteBoard(req, res) {
  const { id } = req.params;
  const boardToDelete = await prisma.board.findUnique({
    where: { id: Number(id) },
  });

  if (!boardToDelete || boardToDelete.userId !== req.user.id) {
    return res
      .status(404)
      .json({ error: "Board non trouvé ou accès non autorisé" });
  }

  await prisma.board.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
}
