import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { sidequestDisplayId } from '../lib/sidequestDisplayId.js'

const router = Router()
router.use(requireAdmin)

const CATEGORIES = ['Nem strand', 'Strand']

function validateInput(body) {
  const { title, category, text } = body
  if (!title || typeof title !== 'string' || !title.trim()) return 'A cím megadása kötelező'
  if (!CATEGORIES.includes(category)) return 'Érvénytelen kategória'
  if (!text || typeof text !== 'string' || !text.trim()) return 'A szöveg megadása kötelező'
  return null
}

function withDisplayId(sidequest) {
  return { ...sidequest, is_hidden: !!sidequest.is_hidden, display_id: sidequestDisplayId(sidequest.id) }
}

router.get('/', (req, res) => {
  const sidequests = db.query('SELECT * FROM sidequests ORDER BY id').all()
  res.json(sidequests.map(withDisplayId))
})

router.post('/', (req, res) => {
  const error = validateInput(req.body)
  if (error) return res.status(400).json({ error })
  const { title, category, text, is_hidden } = req.body
  const sidequest = db
    .query('INSERT INTO sidequests (title, category, text, is_hidden) VALUES (?, ?, ?, ?) RETURNING *')
    .get(title.trim(), category, text.trim(), is_hidden ? 1 : 0)
  res.status(201).json(withDisplayId(sidequest))
})

router.put('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM sidequests WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A sidequest nem található' })
  const error = validateInput(req.body)
  if (error) return res.status(400).json({ error })
  const { title, category, text, is_hidden } = req.body
  const sidequest = db
    .query('UPDATE sidequests SET title = ?, category = ?, text = ?, is_hidden = ? WHERE id = ? RETURNING *')
    .get(title.trim(), category, text.trim(), is_hidden ? 1 : 0, req.params.id)
  res.json(withDisplayId(sidequest))
})

router.delete('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM sidequests WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A sidequest nem található' })
  db.query('DELETE FROM sidequests WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
