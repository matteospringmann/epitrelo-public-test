import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getCards, createCard, updateCard, deleteCard } from '../controllers/cardController.js'

const router = Router()
router.use(requireAuth)

router.get('/', getCards)
router.post('/', createCard)
router.put('/:id', updateCard)
router.delete('/:id', deleteCard)

export default router