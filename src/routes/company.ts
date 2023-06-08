import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";


export async function companyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/company', async (request) => {
    const list = await prisma.company.findMany({
      where: {
        representativeId: request.user.sub
      },
    })

    return list
  })
}