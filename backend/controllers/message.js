const messageRouter = require('express').Router()
const { pool } = require('../sql')

messageRouter.post('/create', async (req, res) => {
  const message = req.body.message
  const userUUID = req.signedCookies.loggedIn  
  const channelUUID = '43ace840-2977-4ebe-a680-c62ef460e05e'

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

module.exports = messageRouter