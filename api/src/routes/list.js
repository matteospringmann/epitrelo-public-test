import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getLists, createList } from '../controllers/listController.js'

const router = Router()
router.use(requireAuth)
router.get('/', getLists)
router.post('/', createList)
export default router