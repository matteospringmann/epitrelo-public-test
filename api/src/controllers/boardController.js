import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getBoards(req, res) {
  const boards = await prisma.board.findMany({
    where: {
      OR: [
        { ownerId: req.user.id },
        { members: { some: { id: req.user.id } } },
      ],
    },
    include: {
      favoritedBy: {
        where: { id: req.user.id },
        select: { id: true },
      },
    },
  });

  // Ajouter le flag isFavorite à chaque board
  const boardsWithFavorite = boards.map(board => ({
    ...board,
    isFavorite: board.favoritedBy.length > 0,
    favoritedBy: undefined, // Supprimer l'info brute
  }));

  res.json(boardsWithFavorite);
}

export async function getBoardById(req, res) {
  const { id } = req.params;
  const board = await prisma.board.findFirst({
    where: {
      id: Number(id),
      OR: [
        { ownerId: req.user.id },
        { members: { some: { id: req.user.id } } },
      ],
    },
    include: {
      members: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      favoritedBy: {
        where: { id: req.user.id },
        select: { id: true },
      },
      lists: {
        orderBy: { id: "asc" },
        include: {
          cards: {
            orderBy: { id: "asc" },
            include: {
              labels: true,
              assignedUser: {
                select: { id: true, name: true, avatarUrl: true },
              },
              comments: {
                include: {
                  user: {
                    select: { id: true, name: true, avatarUrl: true },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
      labels: true,
    },
  });

  if (!board) {
    return res
      .status(404)
      .json({ error: "Board non trouvé ou accès non autorisé" });
  }
  
  const boardWithFavorite = {
    ...board,
    isFavorite: board.favoritedBy.length > 0,
    favoritedBy: undefined,
  };
  
  res.json(boardWithFavorite);
}

export async function createBoard(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Le titre est requis" });
  }
  const board = await prisma.board.create({
    data: {
      title,
      ownerId: req.user.id,
      members: {
        connect: { id: req.user.id },
      },
    },
  });
  res.status(201).json(board);
}

export async function updateBoard(req, res) {
  const { id } = req.params;
  const { title, background } = req.body;

  const boardToUpdate = await prisma.board.findFirst({
    where: {
      id: Number(id),
      OR: [
        { ownerId: req.user.id },
        { members: { some: { id: req.user.id } } },
      ],
    },
  });

  if (!boardToUpdate) {
    return res
      .status(404)
      .json({ error: "Board non trouvé ou accès non autorisé" });
  }

  const updatedBoard = await prisma.board.update({
    where: { id: Number(id) },
    data: { title, background },
  });

  res.json(updatedBoard);
}

export async function deleteBoard(req, res) {
  const { id } = req.params;
  const boardToDelete = await prisma.board.findFirst({
    where: { id: Number(id), ownerId: req.user.id },
  });

  if (!boardToDelete) {
    return res
      .status(403)
      .json({ error: "Accès non autorisé ou Board non trouvé" });
  }

  await prisma.board.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
}

// Ajouter un board aux favoris
export async function addToFavorites(req, res) {
  const { id } = req.params;

  try {
    // Vérifier que l'utilisateur a accès au board
    const board = await prisma.board.findFirst({
      where: {
        id: Number(id),
        OR: [
          { ownerId: req.user.id },
          { members: { some: { id: req.user.id } } },
        ],
      },
    });

    if (!board) {
      return res.status(404).json({ error: "Board non trouvé ou accès non autorisé" });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        favoriteBoards: {
          connect: { id: Number(id) },
        },
      },
    });

    res.json({ message: "Board ajouté aux favoris" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout aux favoris" });
  }
}

// Retirer un board des favoris
export async function removeFromFavorites(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        favoriteBoards: {
          disconnect: { id: Number(id) },
        },
      },
    });

    res.json({ message: "Board retiré des favoris" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du retrait des favoris" });
  }
}

// Récupérer les boards favoris de l'utilisateur
export async function getFavoriteBoards(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        favoriteBoards: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    res.json(user.favoriteBoards || []);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
  }
}
