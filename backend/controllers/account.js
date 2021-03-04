const accountRouter = require('express').Router()
const { pool } = require('../sql')

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

  const namesake = await pool.query('SELECT name FROM Account WHERE name=($1)', [username])
  if (namesake.rows[0]) {
    res.status(400).json({ error: `Username '${namesake.rows[0].name}' already exists` })
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
  console.log('login rows:', rows)
  const id = rows[0].id
  console.log('login id:', id)
  //is cookie-parser used at all?
  //httpOnly? secure: true?
  //fix the expiration time, do I want to use maxAge?
  res.cookie('loggedIn', id,
    { signed: true, expires: new Date(Date.now() + 90000000000), sameSite: 'strict' }
  )

  // res.status(201).json('Logged in!')

  const origin = req.get('origin')
  console.log('login origin', origin)
  //tää redirectautuu post-requestina, eikä se tietty osaa ottaa vastaan semmosta
  // res.redirect(307, `${origin}/app.html`)
  res.redirect(302, `${origin}/app.html`)
})

//logs you out even if you arent logged in
accountRouter.post('/logout', async (req, res) => {
  res.cookie('loggedIn', '', { expires: new Date(Date.now()) })
  res.status(200).json('Logged out!')
  // redirect to login.html
  const origin = req.get('origin')
  res.redirect(307, `${origin}/login.html`)
})

module.exports = accountRouter