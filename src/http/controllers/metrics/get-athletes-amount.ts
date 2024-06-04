import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function getAthletesAmount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const amount = await prisma.athlete.count({
    where: {
      athleteAssociations: {
        some: {
          user: {
            organization_id: orgId,
          },
        },
      },
    },
  })

  return reply.send({
    amount: amount ?? 0,
  })
}
