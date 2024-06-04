import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function getAthletesByGenderAmount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const totalMale = await prisma.athlete.count({
    where: {
      gender: 'MALE',

      athleteAssociations: {
        some: {
          user: {
            organization_id: orgId,
          },
        },
      },
    },
  })

  const totalFemale = await prisma.athlete.count({
    where: {
      gender: 'FEMALE',

      athleteAssociations: {
        some: {
          user: {
            organization_id: orgId,
          },
        },
      },
    },
  })

  return reply.send([
    {
      gender: 'MALE',
      amount: totalMale ?? 0,
    },

    {
      gender: 'FEMALE',
      amount: totalFemale ?? 0,
    },
  ])
}
