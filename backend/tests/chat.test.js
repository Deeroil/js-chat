const { pool } = require('./common')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const path = require('path')
const fs = require('fs')

const init = fs.readFileSync(path.resolve(__dirname, '../../sql/init.sql')).toString()
const drop = fs.readFileSync(path.resolve(__dirname, '../../sql/delete_all.sql')).toString()

//drop tables if exist, init DB
beforeAll(done => {
  pool.query(drop, function (err) {
    done()
    if (err) {
      console.log('error: ', err)
      process.exit(1) //not sure why these are relevant. without them, the DB has errors
    }
    // process.exit(0) <-- not sure about these 
  })

  pool.query(init, function (err) {
    done()
    if (err) {
      console.log('error: ', err)
      process.exit(1)
    }
    // process.exit(0)
  })
})

test('can get /postgres', async () => {
  const result = await api
    .get('/postgres')
    .expect(200)

  expect(result.body.version).toContain('PostgreSQL')
})

test('can connect to postgres', async () => {
  const { rows } = await pool.query('SELECT version()')
  expect(rows[0].version).toContain('PostgreSQL')
})

describe('account creation', () => {
  test('succeeds with new name', async () => {
    const username = 'Bob' + Math.random()
    const result = await api
      .post('/api/account/create')
      .send({ username: username })
      .expect(200)

    expect(result.text).toContain('id')

    const userId = JSON.parse(result.text).id
    const { rows } = await pool.query('SELECT name FROM Account WHERE id = $1', [userId])
    expect(rows[0].name).toContain(username)
  })

  test('can\'t add same name twice', async () => {
    await api
      .post('/api/account/create')
      .send({ username: 'Miinu' })
      .expect(200)

    const result = await api
      .post('/api/account/create')
      .send({ username: 'Miinu' })
      .expect(400)

    expect(result.text).toContain('Username \'Miinu\' already exists')
  })
})

describe('login to backend', () => {
  test('succeeds with Miinu', async () => {
    const result = await api
      .post('/api/account/login')
      .send({ username: 'Miinu' })
      .expect(201)

    expect(result.text).toContain('Logged in!')

    // cookies dont work
    // const info = api
    //   .get('/api/account/info')
    //   .expect(200)
    // console.log('info:', info)
    // expect(info).toContain('Miinu')
  })

  test('fails without name', async () => {
    const result = await api
      .post('/api/account/login')
      .send({})

    expect(result.text).toContain('Missing field username')
  })
})

/*
describe('logout', () => {
  //I prob need to mock document.cookie
  test('logout removes cookie', () => {
    //check no cookie?
    
    //login
    await api
    .post('/api/account/login')
    .send({ username: 'Miinu' })
    .expect(201)

    //check cookie exists
    const result = await api
      .get('/')

    console.log('result')

    //then logout
    expect(1).toBe(2)
  })
})
*/

afterAll(done => {
  pool.end()
  done()
})