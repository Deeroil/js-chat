const channelRouter = require('express').Router()
const { pool } = require('../sql')

channelRouter.get('/info', async (req, res) => {
  const userId = req.signedCookies.loggedIn
  if (!userId) {
    res.status(403).json({ error: "Not logged in" })
  }
  console.log(req.signedCookies.loggedIn)
  const { rows } = await pool.query('SELECT * FROM Account WHERE id = $1', [userId])
  res.json(rows[0])
})

accountRouter.post('/create', async (req, res) => {
  const name = req.body.name
  if (!name) {
    res.status(400).json({ error: "Missing field name" })
    return
  }
  if (name.length < 3) {
    res.status(400).json({ error: "Name too short" })
    return
  }

  //do we want to allow multiple channels w/ same names?
  const namesake = await pool.query('SELECT name FROM Channel WHERE name=($1)', [name])
  if (namesake) {
    res.status(400).json({ error: 'Name already exists' })
    //do we need to return?
  }

  const { rows } = await pool.query('INSERT INTO Channel (name) VALUES ($1) RETURNING id', [name])

  res.json({ id: rows[0].id })
})

channelRouter.post('/join', async (req, res) => {
  const username = req.body.username //??
  const channel = req.body.name //or channelID
  if (!username || !channel) {
    res.status(400).json({ error: "Missing username or channel" })
    return
  }

  //hmm haen nää nyt vaan täällä sisällä: oisko se tieto jossain muualla kivemmin?
  //ööhm tosi toistoisaa. joku for-looppi tjsp??
  const { channelRows } = await pool.query('SELECT id FROM Channel WHERE name = $1', [channel])
  if (channelRows.length === 0) {
    res.status(400).json({ error: "Channel not found" })
    return
  }
  const { accountRows } = await pool.query('SELECT id FROM Account WHERE name = $1', [username])
  if (accountRows.length === 0) {
    res.status(400).json({ error: "Account not found" })
    return
  }
  const channelId = channelRows[0].id
  const accountId = accountRows[0].id

  //btw miten last seen toimii öhm, eiks se oo henkkoht
  // INSERT INTO Channel_Account (channel, account) VALUES (channelUUID, accountUUID)

  res.status(201).end() //end?
})

//logs you out even if you already were
channelRouter.post('/logout', async (req, res) => {
  res.cookie('loggedIn', '', { expires: new Date(Date.now()) })

  res.status(200).json('Logged out!')
})

module.exports = channelRouter