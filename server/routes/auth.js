import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

function safeCompare(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

router.post('/login', (req, res) => {
  const { password } = req.body
  if (typeof password !== 'string' || !safeCompare(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Hibás jelszó' })
  }
  req.session.isAdmin = true
  res.json({ ok: true })
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }))
})

router.get('/session', (req, res) => {
  res.json({ isAdmin: !!req.session?.isAdmin })
})

export default router
