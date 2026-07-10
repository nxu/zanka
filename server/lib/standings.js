import { db } from '../db.js'

export function computeStandings() {
  const people = db.query('SELECT id, name, team_id FROM people').all()
  const teams = db.query('SELECT id, name, color FROM teams').all()

  const rows = db
    .query(
      `SELECT score_entry_points.score_entry_id, score_entry_points.person_id, score_entry_points.points, people.team_id
       FROM score_entry_points
       JOIN people ON people.id = score_entry_points.person_id`
    )
    .all()

  const personTotals = new Map(people.map((p) => [p.id, 0]))
  for (const row of rows) {
    personTotals.set(row.person_id, (personTotals.get(row.person_id) ?? 0) + row.points)
  }

  const entryTeamAgg = new Map()
  for (const row of rows) {
    if (row.team_id === null) continue
    const key = `${row.score_entry_id}:${row.team_id}`
    const agg = entryTeamAgg.get(key) ?? { sum: 0, count: 0 }
    agg.sum += row.points
    agg.count += 1
    entryTeamAgg.set(key, agg)
  }

  const teamTotals = new Map(teams.map((t) => [t.id, 0]))
  for (const [key, { sum, count }] of entryTeamAgg) {
    const teamId = Number(key.split(':')[1])
    teamTotals.set(teamId, (teamTotals.get(teamId) ?? 0) + sum / count)
  }

  return {
    people: people.map((p) => ({ ...p, total: personTotals.get(p.id) ?? 0 })),
    teams: teams.map((t) => ({ ...t, total: teamTotals.get(t.id) ?? 0 })),
  }
}
