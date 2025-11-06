import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Créer un nouveau commentaire
export async function createComment(req, res) {
  const { text, cardId } = req.body;
  const userId = req.user.id;

  if (!text || !cardId) {
    return res
      .status(400)
      .json({ error: "Le texte et l'ID de la carte sont requis." });
  }

  try {
    // Vérifier que l'utilisateur a accès à la carte
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        list: { board: { userId } },
      },
    });

    if (!card) {
      return res
        .status(404)
        .json({ error: "Carte non trouvée ou accès non autorisé." });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        cardId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Impossible de créer le commentaire." });
  }
}
