import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()
router.use(requireAdmin)

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

function validateTeamInput(body) {
  const { name, color } = body
  if (!name || typeof name !== 'string' || !name.trim()) return 'A név megadása kötelező'
  if (typeof color !== 'string' || !HEX_COLOR.test(color)) return 'A színnek érvényes hex kódnak kell lennie, pl. #ff0000'
  return null
}

router.get('/', (req, res) => {
  res.json(db.query('SELECT * FROM teams ORDER BY id').all())
})

router.post('/', (req, res) => {
  const error = validateTeamInput(req.body)
  if (error) return res.status(400).json({ error })
  const { name, color } = req.body
  try {
    const team = db.query('INSERT INTO teams (name, color) VALUES (?, ?) RETURNING *').get(name.trim(), color)
    res.status(201).json(team)
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Már létezik csapat ezzel a névvel' })
    throw err
  }
})

router.put('/:id', (req, res) => {
  const error = validateTeamInput(req.body)
  if (error) return res.status(400).json({ error })
  const existing = db.query('SELECT id FROM teams WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A csapat nem található' })
  const { name, color } = req.body
  try {
    const team = db
      .query('UPDATE teams SET name = ?, color = ? WHERE id = ? RETURNING *')
      .get(name.trim(), color, req.params.id)
    res.json(team)
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Már létezik csapat ezzel a névvel' })
    throw err
  }
})

router.delete('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM teams WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A csapat nem található' })
  db.query('DELETE FROM teams WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
