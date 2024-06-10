import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function volunteers(request: FastifyRequest, reply: FastifyReply) {
  const orgId = request.user.meta.orgId

  const volunteers = await prisma.user.findMany({
    where: {
      organization_id: orgId,
      role: 'VOLUNTEER',
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      area: true,
      status: true,
    },
  })

  return reply.send(volunteers)
}
