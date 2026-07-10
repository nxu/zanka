import { Router } from 'express'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { computeStandings } from '../lib/standings.js'

const router = Router()
router.use(requireAdmin)

router.get('/', (req, res) => {
  res.json(computeStandings())
})

export default router
