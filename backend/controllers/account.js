const accountRouter = require('express').Router()
const { Pool } = require('pg')

const pool = new Pool()

accountRouter.get('/info', async (req, res) => {
  const userId = req.signedCookies.loggedIn
  if (!userId) {
    res.status(403).json({ error: "Not logged in" })
  }
  console.log(req.signedCookies.loggedIn)
  const { rows } = await pool.query('SELECT * FROM Account WHERE id = $1', [userId])
  res.json(rows[0])
})

accountRouter.post('/create', async (req, res) => {
  const username = req.body.username
  if (!username) {
    res.status(400).json({ error: "Missing field username" })
    return
  }
  if (username.length < 3) {
    res.status(400).json({ error: "Username too short" })
    return
  }
  const { rows } = await pool.query('INSERT INTO Account (name) VALUES ($1) RETURNING id', [username])

  res.json({ id: rows[0].id })
})

accountRouter.post('/login', async (req, res) => {
  const username = req.body.username
  if (!username) {
    res.status(400).json({ error: "Missing field username" })
    return
  }

  const { rows } = await pool.query('SELECT id FROM Account WHERE name = $1', [username])
  if (rows.length === 0) {
    res.status(400).json({ error: "User not found" })
    return
  }

  const id = rows[0].id
  //add expiration later
  res.cookie('loggedIn', id,
    { signed: true, sameSite: 'strict', /*secure: true*/ })
  res.status(201).end() //end?
})

//logs you out even if you arent logged in
accountRouter.post('/logout', async (req, res) => {
  res.cookie('loggedIn', '', { expires: new Date(Date.now()) })
  res.status(200).json('Logged out!')
})

module.exports = accountRouter