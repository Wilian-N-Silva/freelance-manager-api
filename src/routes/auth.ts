import bcrypt from "bcrypt";

import { FastifyInstance, FastifyReply } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";


export async function authRoutes(app: FastifyInstance) {

  const doAuthentication = async (email: string, password: string, reply: FastifyReply) => {
    let user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    })

    if (!user) {
      return reply
        .code(401)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: '401 - Unauthorized', reason: 'Unable to find user' })


    }

    const comparePasswords = await bcrypt.compare(password, user.password)

    if (!comparePasswords) {
      return reply
        .code(401)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: '409 - Unauthorized', reason: 'Invalid Credentials' })


    }

    const token = app.jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )


    return {
      token,
    }
  }

  app.post('/signup', async (request, reply) => {
    const bodySchema = z.object({
      taxPayerRegistry: z.string(),
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { email, password, name, taxPayerRegistry } = bodySchema.parse(request.body)

    let user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    })

    if (user) {
      reply
        .code(409)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: '409 - Conflict', reason: 'User already exists' })

      return
    }

    const hashPassword = await bcrypt.hash(password, 10)

    user = await prisma.user.create({
      data: {
        'taxPayerRegistry': taxPayerRegistry,
        'name': name,
        'email': email,
        'password': hashPassword,
      }
    })

    return await doAuthentication(email, password, reply)

  })

  app.post('/authenticate', async (request, reply) => {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    return await doAuthentication(email, password, reply)
  })
}