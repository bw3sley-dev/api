import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function getAnamnesisAmount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const amount = await prisma.anamnesis.count({
    where: {
      athlete: {
        athleteAssociations: {
          some: {
            user: {
              organization_id: orgId,
            },
          },
        },
      },
    },
  })

  return reply.send({
    amount: amount ?? 0,
  })
}
