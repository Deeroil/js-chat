const messageRouter = require('express').Router()
const { pool } = require('../sql')

messageRouter.post('/create', async (req, res) => {
  const message = req.body.message
  const userUUID = req.signedCookies.loggedIn
  const channelUUID = req.body.channel

  if (!message || !userUUID || !channelUUID) {
    res.status(400).json({ error: 'missing argument' })
    return
  }

  //make this a helper function later
  const result = await pool.query(
    `SELECT channel FROM Channel_Account WHERE channel = ($1) AND account = ($2)`,
    [channelUUID, userUUID]
  )

  if (result.rows.length === 0) {
    res.status(400).json({ error: 'User isn\'t on the channel' })
    return
  }

  const { rows } = await pool.query(
    'INSERT INTO Message (sender, channel, text) VALUES ($1, $2, $3) RETURNING id',
    [userUUID, channelUUID, message]
  )

  res.json({ id: rows[0].id })
})

messageRouter.get('/all', async (req, res) => {
  const { rows } = await pool.query('SELECT text, name FROM Message JOIN Account ON Message.sender = Account.id')
  res.json(rows)
})

//should I rather send channel in body
//move to /api/channel? maybe /api/channel/messages
messageRouter.get('/:channel', async (req, res) => {
  const channelUUID = req.params.channel
  const userUUID = req.signedCookies.loggedIn

  if (!userUUID) {
    res.status(400).json({ error: 'Not logged in' })
    return  
  }

  //do I want to check if the channel exists at all?

  const result = await pool.query(
    `SELECT channel FROM Channel_Account WHERE channel = ($1) AND account = ($2)`,
    [channelUUID, userUUID]
  )

  if (result.rows.length === 0) {
    res.status(400).json({ error: 'User isn\'t on the channel' })
    return
  }

  const { rows } = await pool.query(
    `SELECT text, name, Message.created
    FROM Message JOIN Account ON Account.id = Message.sender
    WHERE Message.channel = ($1)`,
    [channelUUID]
  )

  res.json(rows)
})

module.exports = messageRouter