export function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next()
  res.status(401).json({ error: 'Nincs jogosultság' })
}
