import { FastifyInstance } from "fastify";

export async function testRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/test', async (request) => {
    return {
      test: 'oi',
      hehe: 'hehe'
    }
  })

}