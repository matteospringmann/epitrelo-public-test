import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getCards(req, res) {
  const cards = await prisma.card.findMany({ where: { userId: req.user.id } })
  res.json(cards)
}

export async function createCard(req, res) {
  const { title, content, listId } = req.body
  if (!title || !listId) return res.status(400).json({ error: 'Title and listId required' })
  const card = await prisma.card.create({
    data: { title, content, userId: req.user.id, listId }
  })
  res.status(201).json(card)
}

// ...updateCard, deleteCard inchangés...

// Update a card (only if it belongs to the user)
export async function updateCard(req, res) {
  const { id } = req.params
  const { title, content } = req.body
  const card = await prisma.card.findUnique({ where: { id: Number(id) } })
  if (!card || card.userId !== req.user.id) return res.status(404).json({ error: 'Not found' })
  const updated = await prisma.card.update({
    where: { id: Number(id) },
    data: { title, content }
  })
  res.json(updated)
}

// Delete a card (only if it belongs to the user)
export async function deleteCard(req, res) {
  const { id } = req.params
  const card = await prisma.card.findUnique({ where: { id: Number(id) } })
  if (!card || card.userId !== req.user.id) return res.status(404).json({ error: 'Not found' })
  await prisma.card.delete({ where: { id: Number(id) } })
  res.json({ ok: true })
}