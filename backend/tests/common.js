const { pool } = require('../sql')

require('dotenv').config()

beforeAll(done => {
	done();
})

afterAll(done => {
	pool.end();
	done();
})

module.exports = {pool};
