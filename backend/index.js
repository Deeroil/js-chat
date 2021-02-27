require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
const { pool } = require('./sql')
const accountRouter = require('./controllers/account')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3003

app.use(bodyParser.json())
app.use(cookieParser(process.env.SECRET))
app.use(express.static('frontend'))

app.use('/api/account', accountRouter)

app.get('/postgres', async (req, res) => {
  const { rows } = await pool.query('SELECT version()')
  res.json(rows[0])
})

server.listen(PORT, () => {
  console.log(`Running in http://localhost:${PORT}`)
})