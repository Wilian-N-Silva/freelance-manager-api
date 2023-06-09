import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod"
import { log } from "console";

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

  app.post('/client', async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      isCompany: z.coerce.boolean().default(true),
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
      isCompany,
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
        isCompany: isCompany,
        taxPayerRegistry: !!taxPayerRegistry ? taxPayerRegistry : null,
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

  app.put('/client/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const bodySchema = z.object({
      name: z.string(),
      isCompany: z.coerce.boolean().default(true).optional(),
      taxPayerRegistry: z.string().optional(),
      registrationNumber: z.string().optional(),
      companyName: z.string().optional(),
      tradingName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      zipcode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional()
    })

    const { id } = paramsSchema.parse(request.params)

    const {
      name,
      isCompany,
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

    let client = await prisma.client.findUniqueOrThrow({
      where: {
        id: id,
      }
    })

    // if (client.representativeId !== request.user.sub) {
    //   return reply
    //     .code(401)
    //     .header('Content-Type', 'application/json; charset=utf-8')
    //     .send({ message: '409 - Unauthorized', reason: 'Invalid Credentials' })
    // }


    client = await prisma.client.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        isCompany: isCompany,
        taxPayerRegistry: taxPayerRegistry,
        registrationNumber: registrationNumber,
        companyName: companyName,
        tradingName: tradingName,
        phone: phone,
        email: email,
      }
    })


    if (zipcode) {
      let adress = await prisma.address.update({
        where: {
          id: client.addressId!
        },
        data: {
          zipcode: zipcode,
          street: street!,
          number: number!,
          district: district!
        }
      })
    }

    return client
  })
}