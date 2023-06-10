import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from "../lib/prisma";

export async function projectRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    request.jwtVerify()
  })

  app.post('/project', (request, reply) => {
    const bodyParams = z.object({
      "clientId": z.string().uuid(),
      "name": z.string(),
      "description": z.string(),
      "services": z.object({
        "serviceId": z.string().uuid(),
        "value": z.number()
      }).array()
    })

    const { clientId, name, description, services } = bodyParams.parse(request.body)

    let project = prisma.project.create({
      data: {
        clientId: clientId,
        name: name,
        description: description,
        ProjectServices: {
          create: services.map((service) => {
            return {
              serviceId: service.serviceId,
              value: service.value
            }
          })
        }
      }
    })

    return project

  })



}