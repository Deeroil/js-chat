const channelRouter = require('express').Router()
const { pool } = require('../sql')

channelRouter.post('/create', async (req, res) => {
  const userUUID = req.signedCookies.loggedIn
  const name = req.body.channelname

  const { rows } = await pool.query('INSERT INTO Channel (name) VALUES ($1) RETURNING id', [name])
  const channelUUID = rows[0].id

  await pool.query('INSERT INTO Channel_Account (account, channel) VALUES ($1, $2)', [userUUID, channelUUID])

  res.json({ id: channelUUID })
})

channelRouter.post('/join', async (req, res) => {
  const userUUID = req.signedCookies.loggedIn
  const channel = req.body.channelname

  const result = await pool.query('SELECT (id) FROM Channel WHERE name = ($1)', [channel])
  const channelUUID = result.rows[0].id

  if (!channelUUID || !userUUID) {
    res.status(400).json({ error: 'channel or user not found' })
    return
  }

  const clone = await pool.query('SELECT * FROM Channel_Account WHERE channel = ($1) AND account = ($2)', [channelUUID, userUUID])

  if (clone.rows.length > 0) {
    res.status(400).json({ error: `already joined ${channel}` })      
    return
  }

  await pool.query('INSERT INTO Channel_Account (account, channel) VALUES ($1, $2)', [userUUID, channelUUID])
  res.json({ id: channelUUID })
})

channelRouter.post('/invite', async (req, res) => {
  const invited = req.body.invited
  const channel = req.body.channelname

  const channelRes = await pool.query('SELECT (id) FROM Channel WHERE name = ($1)', [channel])
  const userRes = await pool.query('SELECT (id) FROM Account WHERE name = ($1)', [invited])

  const channelUUID = channelRes.rows[0].id
  const userUUID = userRes.rows[0].id

  if (!channelUUID || !userUUID) {
    res.status(400).json({ error: 'channel or user not found' })
    return
  }

  const clone = await pool.query('SELECT * FROM Channel_Account WHERE channel = ($1) AND account = ($2)', [channelUUID, userUUID])
  
  if (clone.rows[0].length > 0) {
    res.status(400).json({ error: `already joined ${channel}` })       
    return
  }

  await pool.query('INSERT INTO Channel_Account (account, channel) VALUES ($1, $2)', [userUUID, channelUUID])
  res.json({ success: true })
})

//TODO: maybe move to /api/account
channelRouter.get('/joined', async (req, res) => {
  const userUUID = req.signedCookies.loggedIn

  if (!userUUID) {
    res.status(400).json({ error: 'not logged in' })
    return
  }

  const { rows } = await pool.query('SELECT name, id FROM Channel_Account JOIN Channel ON Channel_Account.channel = Channel.id WHERE account = ($1)', [userUUID])
    
  console.log('joined channels rows:', rows)
  res.json(rows)
})

module.exports = channelRouter