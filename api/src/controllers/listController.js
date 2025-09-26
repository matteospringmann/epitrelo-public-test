import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getLists(req, res) {
  const lists = await prisma.list.findMany({
    where: { userId: req.user.id },
    include: { cards: true }
  })
  res.json(lists)
}

export async function createList(req, res) {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title required' })
  const list = await prisma.list.create({
    data: { title, userId: req.user.id }
  })
  res.status(201).json(list)
}