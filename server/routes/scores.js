import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { getEntryWithPoints } from '../lib/scoreEntries.js'

const router = Router()
router.use(requireAdmin)

function validatePointsInput(points) {
  if (!Array.isArray(points) || points.length === 0) return 'Legalább egy játékost ki kell választani'
  const seen = new Set()
  for (const p of points) {
    if (!Number.isInteger(p?.person_id)) return 'Érvénytelen játékos azonosító'
    if (seen.has(p.person_id)) return 'Egy játékos csak egyszer szerepelhet egy bejegyzésben'
    seen.add(p.person_id)
    if (typeof p.points !== 'number' || !Number.isFinite(p.points) || p.points < 0) {
      return 'A pontszám nem lehet negatív'
    }
    if (!db.query('SELECT id FROM people WHERE id = ?').get(p.person_id)) {
      return 'A játékos nem található'
    }
  }
  return null
}

const insertEntry = db.transaction((title, points) => {
  const { id } = db.query('INSERT INTO score_entries (title) VALUES (?) RETURNING id').get(title)
  const insertPoint = db.query('INSERT INTO score_entry_points (score_entry_id, person_id, points) VALUES (?, ?, ?)')
  for (const p of points) insertPoint.run(id, p.person_id, p.points)
  return id
})

const replaceEntry = db.transaction((id, title, points) => {
  db.query('UPDATE score_entries SET title = ? WHERE id = ?').run(title, id)
  db.query('DELETE FROM score_entry_points WHERE score_entry_id = ?').run(id)
  const insertPoint = db.query('INSERT INTO score_entry_points (score_entry_id, person_id, points) VALUES (?, ?, ?)')
  for (const p of points) insertPoint.run(id, p.person_id, p.points)
})

router.get('/', (req, res) => {
  const ids = db.query('SELECT id FROM score_entries ORDER BY id DESC').all()
  res.json(ids.map((row) => getEntryWithPoints(row.id)))
})

router.post('/', (req, res) => {
  const { title, points } = req.body
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A bejegyzés címe kötelező' })
  }
  const error = validatePointsInput(points)
  if (error) return res.status(400).json({ error })

  const id = insertEntry(title.trim(), points)
  res.status(201).json(getEntryWithPoints(id))
})

router.put('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM score_entries WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A bejegyzés nem található' })
  const { title, points } = req.body
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A bejegyzés címe kötelező' })
  }
  const error = validatePointsInput(points)
  if (error) return res.status(400).json({ error })

  replaceEntry(req.params.id, title.trim(), points)
  res.json(getEntryWithPoints(req.params.id))
})

router.delete('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM score_entries WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A bejegyzés nem található' })
  db.query('DELETE FROM score_entries WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
