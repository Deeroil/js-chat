const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const {pool} = require('./common')

/** Muista kattella ettei unohdu asyncit
 * Hmm, se key -valitus taitaa olla sittenkin postgres-ongelma,
 * ehkä mun pitää mockaa sitä jotenkin?
 * Tai jotenkin kirjautua sinne sisälle tjsp
 * Tai pg pitää ehkä jotenkin maagisesti konfiguroida
 * 
 * Kaikkien account-routejen testausten status on 400, ja erroria koska body.req on tyhjä
 */

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

//req.body is empty, fails
describe('account creation', () => {
  test('succeeds with new name', async () => {
    let username = "Bob" + Math.random();
    const result = await api
      .post('/api/account/create')
      .send({username})
    //ei voi laittaa send({username: 'Bob' })
    //kun sit tulee type error,
    //mut jos laitan objektina nii response valittaa että username empty
    // .expect(200)

    console.log('result.body', result.body)

    expect(result.text).toContain(username)
  })

  test('fails with existing name', async () => {
    const result = await api
      .post('/api/account/create')
      .type('text')
      .send('Miinu')
    // .expect(400) //menee rikki jos

    expect(result.text).toContain('Username already exists')
  })
})

describe('login to backend', () => {
  // beforeEach(async () => {
  //   const newUser = {
  //     username: 'user',
  //   }
  //   //vai const user = 'user' ...?
  //   const result = await api
  //     .post('/api/login')
  //     .send(newUser)
  // })

  //bad request, kai !username?
  test('succeeds with Miinu', async () => {
    const result = await api
      .post('/api/account/login')
      .send('Miinu')
    // .expect(201)

    // console.log('result Miinu:', result)
    expect(result.text).toContain('Logged in!')
    //also test .get('/api/account/info') for Miinu
  })

  /*
  // TypeError: The "key" argument must be of type string or an instance of Buffer,...
  //... received null
  test('login succeeds with correct name', async () => {
    //expert res to be blabla
    // const username = { username: 'Miinu' } //lienee tää rivi!
    const username = 'Saalis'
    const result = await api
      .post('/api/account/login')
      .send(username)
      .expect(201)

    console.log('result:', result)
    expect(result.text).toContain('Logged in!')
  })
  */

  test('fails without name', async () => {
    //expert res to be blabla
    const result = await api
      .post('/api/account/login')
      .send({})

    expect(result.text).toContain('Missing field username')
  })
})

/*
describe('logout', () => {
  test('logout removes cookie', () => {
    //check no cookie?
    //login
    //check cookie exists
    //then logout
  })
})
*/
