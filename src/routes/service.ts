import { FastifyInstance } from "fastify";
import { string, z } from "zod"
import { prisma } from "../lib/prisma";

export async function serviceRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.post('/service', (request, reply) => {
    const bodySchema = z.object({
      "description": z.string(),
      "value": z.number(),
    })

    const { description, value } = bodySchema.parse(request.body)

    let service = prisma.service.create({
      data: {
        description: description,
        value: value
      }
    })

    return service
  })

  app.get('/service/:id', (request, reply) => {
    const paramsSchema = z.object({
      'id': z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    let service = prisma.service.findUniqueOrThrow({
      where: {
        id: id
      }
    })

    return service
  })

  app.get('/service', (request, reply) => {
    let service = prisma.service.findMany()
    return service
  })

  app.put('/service/:id', (request, reply) => {
    const paramsSchema = z.object({
      "id": z.string().uuid()
    })

    const bodySchema = z.object({
      "description": z.string(),
      "value": z.number(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { description, value } = bodySchema.parse(request.body)

    let service = prisma.service.update({
      where: {
        id: id
      },
      data: {
        description: description,
        value: value
      }
    })

    return service
  })

  app.delete('/service/:id', (request, reply) => {
    const paramsSchema = z.object({
      'id': z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    let service = prisma.service.delete({
      where: {
        id: id
      }
    })

    return reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ message: 'Service deleted successfully' })
  })
}
