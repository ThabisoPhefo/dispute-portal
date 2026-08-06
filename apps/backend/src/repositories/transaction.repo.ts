import { prisma } from '../lib/prisma'

export const transactionRepo = {
  findAll() {
    return prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    })
  },

  findById(id: string) {
    return prisma.transaction.findUnique({ where: { id } })
  },
}
