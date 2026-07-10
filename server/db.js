import { Database } from 'bun:sqlite'
import path from 'path'
import fs from 'fs'

const dbPath = process.env.DB_PATH || path.join(import.meta.dir, 'data', 'app.db')
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

export const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)
