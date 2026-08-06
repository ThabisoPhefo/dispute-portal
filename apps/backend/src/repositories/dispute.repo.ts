import type { DisputeStatus, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const disputeRepo = {
  findAll() {
    return prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  findByRef(ref: string) {
    return prisma.dispute.findFirst({
      where: { ref: { equals: ref, mode: 'insensitive' } },
    })
  },

  findById(id: string) {
    return prisma.dispute.findUnique({ where: { id } })
  },

  create(data: Prisma.DisputeCreateInput) {
    return prisma.dispute.create({ data })
  },

  updateStatus(id: string, status: DisputeStatus) {
    return prisma.dispute.update({
      where: { id },
      data: { status },
    })
  },
}
