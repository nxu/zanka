import { db } from '../db.js'

export function getEntryWithPoints(id) {
  const entry = db.query('SELECT id, title, created_at FROM score_entries WHERE id = ?').get(id)
  if (!entry) return null
  const points = db
    .query(
      `SELECT score_entry_points.person_id, score_entry_points.points,
              people.name AS person_name, people.team_id,
              teams.name AS team_name, teams.color AS team_color
       FROM score_entry_points
       JOIN people ON people.id = score_entry_points.person_id
       LEFT JOIN teams ON teams.id = people.team_id
       WHERE score_entry_points.score_entry_id = ?
       ORDER BY people.name`
    )
    .all(id)
  return { ...entry, points }
}

export function getLatestEntry() {
  const row = db.query('SELECT id FROM score_entries ORDER BY id DESC LIMIT 1').get()
  return row ? getEntryWithPoints(row.id) : null
}
