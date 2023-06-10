import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const paymentPeriods = [
    { 'name': 'À VISTA' },
    { 'name': 'PARCELADO' },
    { 'name': 'MENSAL' },
  ]

  paymentPeriods.map(async (paymentPeriod) => {
    await prisma.paymentPeriod.create({
      data: {
        name: paymentPeriod.name
      }
    })
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })