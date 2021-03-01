const { pool } = require('./common')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('testing /test', () => {
  test('test works with test obj', async () => {
    const result = await api
      .post('/test')
      .send({ test: 'jiihaa' })
      .expect(201)

    expect(result.body).toContain('jiihaa') //miks se menee .textiin :D
  })

  test('test fails with wrong obj', async () => {
    const result = await api
      .post('/test')
      .send({ wrong: 'jiihaa' })
      .expect(400)

    expect(result.body.error).toContain('test not found from body') //miks se menee .textiin :D koska se on vaan teksti?
  })

  test('test fails with undefined', async () => {
    const result = await api
      .post('/test')
      .send(undefined)
      .expect(400)

    expect(result.body.error).toContain('test not found from body') //miks se menee .textiin :D koska se on vaan teksti?
  })
})