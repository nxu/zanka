import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()
router.use(requireAdmin)

function validateInput(body) {
  const { name, task, points } = body
  if (!name || typeof name !== 'string' || !name.trim()) return 'A név megadása kötelező'
  if (!task || typeof task !== 'string' || !task.trim()) return 'A feladat leírása kötelező'
  if (!Number.isInteger(points)) return 'A pontszámnak egész számnak kell lennie'
  return null
}

router.get('/', (req, res) => {
  res.json(db.query('SELECT * FROM task_cards ORDER BY id').all())
})

router.post('/', (req, res) => {
  const error = validateInput(req.body)
  if (error) return res.status(400).json({ error })
  const { name, task, points } = req.body
  const card = db
    .query('INSERT INTO task_cards (name, task, points) VALUES (?, ?, ?) RETURNING *')
    .get(name.trim(), task.trim(), points)
  res.status(201).json(card)
})

router.put('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM task_cards WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A feladatkártya nem található' })
  const error = validateInput(req.body)
  if (error) return res.status(400).json({ error })
  const { name, task, points } = req.body
  const card = db
    .query('UPDATE task_cards SET name = ?, task = ?, points = ? WHERE id = ? RETURNING *')
    .get(name.trim(), task.trim(), points, req.params.id)
  res.json(card)
})

router.delete('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM task_cards WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A feladatkártya nem található' })
  db.query('DELETE FROM task_cards WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
