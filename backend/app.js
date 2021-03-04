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

app.get('/login', async (req, res) => {
  res.redirect('/app.html')
})

app.get('/logout', (req, res) => {
  res.redirect('/login.html')
})

module.exports = app