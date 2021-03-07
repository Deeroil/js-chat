const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const accountRouter = require('./controllers/account')
const { pool } = require('./sql')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser(process.env.SECRET))
app.use(express.static('frontend'))

app.use('/api/account', accountRouter)

app.get('/postgres', async (req, res) => {
  const { rows } = await pool.query('SELECT version()')
  res.json(rows[0])
})

app.post('/test', async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: 'body not found' })
  }

  if (!req.body.test) {
    res.status(400).json({ error: 'test not found from body' })
  }

  res.status(201).json(req.body.test)
})

module.exports = app