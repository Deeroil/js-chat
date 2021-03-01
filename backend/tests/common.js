require('dotenv').config()
const { pool } = require('../sql')

beforeAll(done => done())

afterAll(done => {
	pool.end()
	done()
})

module.exports = { pool }