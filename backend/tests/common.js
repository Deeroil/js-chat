require('dotenv').config()

if (process.env.NODE_ENV === 'test') {
  process.env.PGDATABASE = process.env.PGDATABASE_TEST
}

const { pool } = require('../sql')

// i should drop/empty the tables if exist and then recreate them
beforeAll(done => done())

afterAll(done => {
  pool.end()
  done()
})

module.exports = { pool }