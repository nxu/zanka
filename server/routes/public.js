import { Router } from 'express'
import { computeStandings } from '../lib/standings.js'
import { getLatestEntry } from '../lib/scoreEntries.js'

const router = Router()

router.get('/dashboard', (req, res) => {
  const { teams, people } = computeStandings()
  const teamById = new Map(teams.map((t) => [t.id, t]))

  const topPeople = [...people]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map((p) => {
      const team = p.team_id !== null ? teamById.get(p.team_id) : null
      return {
        id: p.id,
        name: p.name,
        total: p.total,
        team_name: team?.name ?? null,
        team_color: team?.color ?? null,
      }
    })

  const sortedTeams = [...teams].sort((a, b) => b.total - a.total)

  res.json({
    teams: sortedTeams,
    topPeople,
    latestEntry: getLatestEntry(),
  })
})

export default router
