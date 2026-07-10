import { db } from '../db.js'

function attachPoints(entryRows) {
  const pointsByEntry = new Map(entryRows.map((e) => [e.id, []]))
  if (entryRows.length) {
    const placeholders = entryRows.map(() => '?').join(',')
    const pointRows = db
      .query(
        `SELECT score_entry_points.score_entry_id, score_entry_points.person_id, score_entry_points.points,
                people.name AS person_name, people.team_id,
                teams.name AS team_name, teams.color AS team_color
         FROM score_entry_points
         JOIN people ON people.id = score_entry_points.person_id
         LEFT JOIN teams ON teams.id = people.team_id
         WHERE score_entry_points.score_entry_id IN (${placeholders})
         ORDER BY people.name`
      )
      .all(...entryRows.map((e) => e.id))
    for (const row of pointRows) {
      pointsByEntry.get(row.score_entry_id).push(row)
    }
  }
  return entryRows.map((e) => ({ ...e, points: pointsByEntry.get(e.id) }))
}

export function getEntryWithPoints(id) {
  const entry = db.query('SELECT id, title, created_at FROM score_entries WHERE id = ?').get(id)
  if (!entry) return null
  return attachPoints([entry])[0]
}

export function getLatestEntries(limit) {
  const entryRows = db.query('SELECT id, title, created_at FROM score_entries ORDER BY id DESC LIMIT ?').all(limit)
  return attachPoints(entryRows)
}
