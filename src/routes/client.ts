import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod"

export async function clientRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/client', async (request) => {
    let clientList = await prisma.client.findMany()
    return clientList
  })

  app.get('/client/:id', async (request) => {
    const bodySchema = z.object({
      id: z.string().uuid()
    })

    const { id } = bodySchema.parse(request.params)

    let clientList = await prisma.client.findUniqueOrThrow({
      where: {
        id: id
      }
    })

    return clientList
  })

  app.post('/client/register', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      taxPayerRegistry: z.string().optional(),
      registrationNumber: z.string().optional(),
      companyName: z.string().optional(),
      tradingName: z.string().optional(),
      phone: z.string(),
      email: z.string(),
      zipcode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional()
    })

    const {
      name,
      taxPayerRegistry,
      registrationNumber,
      companyName,
      tradingName,
      phone,
      email,
      zipcode,
      street,
      number,
      district
    } = bodySchema.parse(request.body)

    let client = await prisma.client.create({
      data: {
        name: name,
        taxPayerRegistry: taxPayerRegistry,
        registrationNumber: registrationNumber,
        companyName: companyName,
        tradingName: tradingName,
        phone: phone,
        email: email,
      }
    })
    

    if (zipcode) {
      let adress = await prisma.address.create({
        data: {
          zipcode: zipcode,
          street: street!,
          number: number!,
          district: district!
        }
      })

      await prisma.client.update({
        where: {
          id: client.id
        },
        data: {
          address: {
            connect: {
              id: adress.id
            }
          }
        }
      })
    }

    return client
  })
}