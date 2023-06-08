import bcrypt from "bcrypt";

import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";


export async function authRoutes(app: FastifyInstance) {
  app.post('/signup', async (request) => {
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

    if (!user) {
      const hashPassword = await bcrypt.hash(password, 10)

      user = await prisma.user.create({
        data: {
          'taxPayerRegistry': taxPayerRegistry,
          'name': name,
          'email': email,
          'password': hashPassword,
        }
      })
    }

  })

  app.post('/authenticate', async (request) => {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(request.body)

    let user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    })

    if (!user) {
      return "User doesn't exists"
    }

    const comparePasswords = await bcrypt.compare(password, user.password)

    if (!comparePasswords) {
      return 'Wrong data'
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
  })
}