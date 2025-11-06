import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export async function createInvitation(req, res) {
  const { boardId } = req.params;

  // Seul le propriétaire peut créer une invitation
  const board = await prisma.board.findFirst({
    where: { id: Number(boardId), ownerId: req.user.id },
  });

  if (!board) {
    return res.status(403).json({ error: "Accès non autorisé." });
  }

  const token = randomBytes(16).toString("hex");
  const invitation = await prisma.invitation.create({
    data: {
      token,
      boardId: Number(boardId),
    },
  });

  res.status(201).json({
    inviteLink: `${process.env.CORS_ORIGIN}/invite/${invitation.token}`,
  });
}

export async function acceptInvitation(req, res) {
  const { token } = req.params;
  const invitation = await prisma.invitation.findUnique({ where: { token } });

  if (!invitation) {
    return res.status(404).json({ error: "Invitation invalide ou expirée." });
  }

  // Ajouter l'utilisateur actuel comme membre du board
  await prisma.board.update({
    where: { id: invitation.boardId },
    data: {
      members: {
        connect: { id: req.user.id },
      },
    },
  });

  // Supprimer l'invitation pour qu'elle ne soit pas réutilisée
  await prisma.invitation.delete({ where: { token } });

  res.json({ boardId: invitation.boardId });
}
