import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/requireAdmin.js'

const router = Router()
router.use(requireAdmin)

const PEOPLE_WITH_TEAM = `
  SELECT people.id, people.name, people.team_id, teams.name AS team_name, teams.color AS team_color
  FROM people
  LEFT JOIN teams ON teams.id = people.team_id
`

function normalizeTeamId(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isInteger(n) ? n : undefined
}

router.get('/', (req, res) => {
  res.json(db.query(`${PEOPLE_WITH_TEAM} ORDER BY people.id`).all())
})

router.post('/', (req, res) => {
  const { name, team_id } = req.body
  if (!name || typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'A név megadása kötelező' })
  const teamId = normalizeTeamId(team_id)
  if (teamId === undefined) return res.status(400).json({ error: 'Érvénytelen csapat azonosító' })
  if (teamId !== null && !db.query('SELECT id FROM teams WHERE id = ?').get(teamId)) {
    return res.status(400).json({ error: 'A csapat nem található' })
  }
  const { id } = db.query('INSERT INTO people (name, team_id) VALUES (?, ?) RETURNING id').get(name.trim(), teamId)
  res.status(201).json(db.query(`${PEOPLE_WITH_TEAM} WHERE people.id = ?`).get(id))
})

router.put('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM people WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A játékos nem található' })
  const { name, team_id } = req.body
  if (!name || typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'A név megadása kötelező' })
  const teamId = normalizeTeamId(team_id)
  if (teamId === undefined) return res.status(400).json({ error: 'Érvénytelen csapat azonosító' })
  if (teamId !== null && !db.query('SELECT id FROM teams WHERE id = ?').get(teamId)) {
    return res.status(400).json({ error: 'A csapat nem található' })
  }
  db.query('UPDATE people SET name = ?, team_id = ? WHERE id = ?').run(name.trim(), teamId, req.params.id)
  res.json(db.query(`${PEOPLE_WITH_TEAM} WHERE people.id = ?`).get(req.params.id))
})

router.delete('/:id', (req, res) => {
  const existing = db.query('SELECT id FROM people WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'A játékos nem található' })
  db.query('DELETE FROM people WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
