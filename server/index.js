import express from 'express'
import path from 'path'
import apiRouter from './routes/api.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api', apiRouter)
app.use(express.static(path.join(import.meta.dir, 'public')))

app.get('*', (req, res) => {
  res.sendFile(path.join(import.meta.dir, 'public', 'index.html'))
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
