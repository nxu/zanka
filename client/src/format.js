const scoreFormatter = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 1 })

export function formatScore(n) {
  return scoreFormatter.format(n)
}

export function formatDate(sqliteTimestamp) {
  const date = new Date(sqliteTimestamp.replace(' ', 'T') + 'Z')
  return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })
}
