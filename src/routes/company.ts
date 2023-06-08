import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { log } from "console";


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

  app.post('/company', async (request) => {
    const bodySchema = z.object({
      registrationNumber: z.string(),
      companyName: z.string(),
      tradingName: z.string().optional(),
      phone: z.string(),
      email: z.string(),
      zipcode: z.string().optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      district: z.string().optional()
    })

    const {
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

    let company = await prisma.company.create({
      data: {
        representativeId: request.user.sub,
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

      await prisma.company.update({
        where: {
          id: company.id
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

    return company
  })

  app.put('/company/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const bodySchema = z.object({
      registrationNumber: z.string(),
      companyName: z.string(),
      tradingName: z.string().optional(),
      phone: z.string(),
      email: z.string(),
      zipcode: z.string(),
      street: z.string(),
      number: z.string(),
      district: z.string()
    })

    const { id } = paramsSchema.parse(request.params)

    const {
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

    let company = await prisma.company.findUniqueOrThrow({
      where: {
        id: id,
      }
    })



    if (company.representativeId !== request.user.sub) {
      return reply
        .code(401)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: '409 - Unauthorized', reason: 'Invalid Credentials' })
    }


    company = await prisma.company.update({
      where: {
        id: id,
      },
      data: {
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
          id: company.addressId!
        },
        data: {
          zipcode: zipcode,
          street: street!,
          number: number!,
          district: district!
        }
      })
    }

    return company
  })
}