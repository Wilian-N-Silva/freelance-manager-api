import { afterAll, expect, test } from 'vitest'
import axios from 'axios'
import { app } from '../src/server'

test('user signup', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/signup',
    body: {
      "taxPayerRegistry": "000.000.000-00",
      "email": "test@test.com",
      "name": "Tester",
      "password": "TestPassword123"
    },
  })

  expect(response.statusCode).toBe(200)
})

test('user authenticate', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/authenticate',
    body: {
      "email": "test@test.com",
      "password": "TestPassword123"
    },
  })

  expect(response.statusCode).toBe(200)
  expect(response.payload).toString()

})

afterAll(async () => {
  await app.close()
})