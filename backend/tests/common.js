require('dotenv').config()
const { pool } = require('../sql')

if (process.env.NODE_ENV === 'test') {
  process.env.PGDATABASE = process.env.PGDATABASE_TEST
}

module.exports = { pool }