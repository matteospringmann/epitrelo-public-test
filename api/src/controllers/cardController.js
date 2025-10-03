// api/src/controllers/cardController.js (Version Finale et Fiable)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ... createCard et getCards restent les mêmes ...
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
    console.error("Erreur lors de la création de la carte:", error);
    res.status(500).json({ error: "Impossible de créer la carte" });
  }
}

export async function updateCard(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;

  // On met à jour la carte SEULEMENT si elle existe et appartient à une liste
  // dont le board appartient à l'utilisateur.
  const updatedCard = await prisma.card.updateMany({
    where: {
      id: Number(id),
      list: { board: { userId: req.user.id } },
    },
    data: { title, content },
  });

  if (updatedCard.count === 0) {
    return res
      .status(404)
      .json({ error: "Carte non trouvée ou accès non autorisé" });
  }

  res.json({ message: "Carte mise à jour" });
}

// --- CORRECTION DE LA LOGIQUE DE SUPPRESSION ---
export async function deleteCard(req, res) {
  const { id } = req.params;
  try {
    // On utilise `deleteMany` avec une condition de sécurité imbriquée.
    // Cela supprime la carte SEULEMENT si elle correspond à l'ID ET
    // si elle appartient à une liste d'un board de l'utilisateur connecté.
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

    // Si `deleteResult.count` est 0, cela signifie qu'aucune carte n'a été supprimée,
    // soit parce que l'ID était mauvais, soit parce que l'utilisateur n'avait pas les droits.
    if (deleteResult.count === 0) {
      return res
        .status(404)
        .json({ error: "Carte non trouvée ou accès non autorisé" });
    }

    // La suppression a réussi
    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la carte:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
