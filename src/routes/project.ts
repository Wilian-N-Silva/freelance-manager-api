import { FastifyInstance } from "fastify";
import { z } from "zod"
import { prisma } from "../lib/prisma";
import { log } from "console";

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
        "value": z.number(),
        "qty": z.number()
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
              value: service.value,
              qty: service.qty
            }
          })
        }
      }
    })

    return project
  })

  app.get('/project', (request, reply) => {
    const list = prisma.project.findMany({
      include: {
        client: {},
        ProjectServices: {
          include: {
            service: {}
          }
        },
      }
    })
    return list
  })

  app.get('/project/:id', (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const list = prisma.project.findMany({
      include: {
        client: {},
        ProjectServices: {
          include: {
            service: {}
          }
        },
      }
    })

    const project = prisma.project.findUniqueOrThrow({
      where: {
        id: id
      },
      include: {
        client: {},
        ProjectServices: {
          include: {
            service: {}
          }
        },
      }
    })


    return project
  })

  app.put('/project/:id', (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodyParams = z.object({
      "clientId": z.string().uuid(),
      "name": z.string(),
      "description": z.string(),
      "services": z.object({
        "serviceId": z.string().uuid(),
        "value": z.number(),
        "qty": z.number()
      }).array()
    })

    const { id } = paramsSchema.parse(request.params)

    const { clientId, name, description, services } = bodyParams.parse(request.body)

    let project = prisma.project.update({
      where: {
        id: id
      },
      data: {
        clientId: clientId,
        name: name,
        description: description,
        ProjectServices: {
          deleteMany: {
            projectId: id
          },
          create: services.map((service) => {
            return {
              serviceId: service.serviceId,
              value: service.value,
              qty: service.qty
            }
          })
        }
      }
    })

    return project
  })

  app.delete('/project/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    let exists = await prisma.project.findFirst({
      where: {
        id: id
      }
    })

    if (!exists) {
      return reply
        .code(401)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: '401 - Unauthorized', reason: 'Unable to find project' })
    }


    let pivotTable = prisma.projectServices.deleteMany({
      where: {
        projectId: id
      }
    })

    let project = prisma.project.delete({
      where: {
        id: id
      }
    })

    const transaction = await prisma.$transaction([pivotTable, project]).then(() => {
      return reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Project deleted successfully' })
    })

  })

}