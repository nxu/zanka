import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/items', (req, res) => {
  const items = db.query('SELECT * FROM items ORDER BY id DESC').all()
  res.json(items)
})

router.post('/items', (req, res) => {
  const { name } = req.body
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' })
  }
  const item = db.query('INSERT INTO items (name) VALUES (?) RETURNING *').get(name)
  res.status(201).json(item)
})

router.delete('/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
