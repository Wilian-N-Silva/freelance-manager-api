import 'dotenv/config'

import fastify from "fastify";
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { testRoutes } from "./routes/tests";
import { authRoutes } from './routes/auth';


const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'super',
})

app.register(testRoutes)
app.register(authRoutes)


app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {

  console.log(`HTTP server running on http://localhost:${process.env.HTTP_PORT}`)
})