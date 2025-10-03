import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createCard(req, res) {
  const { title, content, listId } = req.body;
  if (!title || !listId) {
    return res
      .status(400)
      .json({ error: "Le titre et l'ID de la liste sont requis" });
  }
  try {
    const list = await prisma.list.findFirst({
      where: { id: listId, board: { userId: req.user.id } },
    });
    if (!list) {
      return res
        .status(404)
        .json({ error: "Liste non trouvée ou accès non autorisé" });
    }
    const card = await prisma.card.create({
      data: { title, content, listId },
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: "Impossible de créer la carte" });
  }
}

export async function updateCard(req, res) {
  const { id } = req.params;
  const dataToUpdate = req.body;

  try {
    const cardToUpdate = await prisma.card.findFirst({
      where: {
        id: Number(id),
        list: { board: { userId: req.user.id } },
      },
    });

    if (!cardToUpdate) {
      return res
        .status(404)
        .json({ error: "Carte non trouvée ou accès non autorisé" });
    }

    const updatedCard = await prisma.card.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    res.json(updatedCard);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la carte" });
  }
}

export async function deleteCard(req, res) {
  const { id } = req.params;
  try {
    const deleteResult = await prisma.card.deleteMany({
      where: {
        id: Number(id),
        list: {
          board: {
            userId: req.user.id,
          },
        },
      },
    });

    if (deleteResult.count === 0) {
      return res
        .status(404)
        .json({ error: "Carte non trouvée ou accès non autorisé" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
