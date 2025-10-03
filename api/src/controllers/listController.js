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

    // Vérifier que le board appartient bien à l'utilisateur (sécurité)
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board || board.userId !== req.user.id) {
        return res.status(404).json({ error: "Board non trouvé" });
    }

    const list = await prisma.list.create({
        data: { title, boardId },
    });
    res.status(201).json(list);
}
