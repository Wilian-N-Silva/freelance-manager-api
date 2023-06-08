import 'dotenv/config'

import fastify from "fastify";
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { userRoutes } from './routes/user';
import { clientRoutes } from './routes/client';
import { companyRoutes } from './routes/company';

export const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'super',
})

app.register(userRoutes)
app.register(companyRoutes)
app.register(clientRoutes)


app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log(`HTTP server running on http://localhost:${process.env.HTTP_PORT}`)
})