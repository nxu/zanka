for (const key of ['ADMIN_PASSWORD', 'SESSION_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

import express from 'express'
import session from 'express-session'
import path from 'path'
import authRouter from './routes/auth.js'
import teamsRouter from './routes/teams.js'
import peopleRouter from './routes/people.js'
import scoresRouter from './routes/scores.js'
import standingsRouter from './routes/standings.js'
import publicRouter from './routes/public.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
)

app.use('/api/auth', authRouter)
app.use('/api/admin/teams', teamsRouter)
app.use('/api/admin/people', peopleRouter)
app.use('/api/admin/scores', scoresRouter)
app.use('/api/admin/standings', standingsRouter)
app.use('/api/public', publicRouter)

app.use(express.static(path.join(import.meta.dir, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(import.meta.dir, 'public', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
