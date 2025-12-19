// api/src/controllers/searchController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function globalSearch(req, res) {
  const { q } = req.query;
  const userId = req.user.id;

  if (!q || q.trim().length < 2) {
    return res.json({ boards: [], cards: [] });
  }

  const searchTerm = q.trim().toLowerCase();

  try {
    // Recherche dans les boards
    const boards = await prisma.board.findMany({
      where: {
        AND: [
          {
            OR: [
              { ownerId: userId },
              { members: { some: { id: userId } } },
            ],
          },
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        background: true,
        updatedAt: true,
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
    });

    // Recherche dans les cartes
    const cards = await prisma.card.findMany({
      where: {
        AND: [
          {
            list: {
              board: {
                OR: [
                  { ownerId: userId },
                  { members: { some: { id: userId } } },
                ],
              },
            },
          },
          {
            OR: [
              {
                title: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                content: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        list: {
          select: {
            id: true,
            title: true,
            board: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        labels: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ boards, cards });
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
}