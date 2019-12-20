
const request = require("supertest");

const server = require("./server.js");

const db = require('../database/dbconfig.js')

beforeEach(async () => {
  await db('users').truncate()
})

describe('server.js', () => {
  describe('register route', () => {
    it('should give a 404 if password not given', () => {
      return request(server)
        .post('/api/auth/register')
        .then(res => expect(res.status).toBe(404))
    })

    it('should send 201 on successful registration', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"chase", password:"pass"})
        .then(res => expect(res.status).toBe(201))
    })
  })

  describe('login route', () => {
    it('should give 401 if credentials are bad', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"chase", password:"123"})
        .then(res => {
          return request(server)
          .post('/api/auth/login')
          .send({username:"chase", password:"pass"})
          .then(res2 => expect(res2.status).toBe(401))
        })
    })

    it('should send 200 if credentials are valid', () => {
      return request(server)
        .post('/api/auth/register')
        .send({username:"chase", password:"pass"})
        .then(res => {
          return request(server)
          .post('/api/auth/login')
          .send({username:"chase", password:"pass"})
          .then(res2 => expect(res2.status).toBe(200))
        })
    })
  })

  describe('jokes route', () => {
    it('should send code 401 if not logged in', () => {
      return request(server)
        .get('/api/jokes')
        .then(res => expect(res.status).toBe(401))
    })

    it('should send status code 200 if logged in', () => {
      request(server)
      .post('/api/auth/register')
      .send({username:"chase", password:"pass"})
      .then(res => {
        request(server)
        .post('/api/auth/login')
        .send({username:"chase", password:"pass"})
        .then(res2 => {
          request(server)
          .get('/api/jokes')
          .then(res3 => expect(res3.status).toBe(200))
        })
      })
    })
  })
})