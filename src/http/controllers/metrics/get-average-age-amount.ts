import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import dayjs from 'dayjs'

export async function getAverageAgeAmount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const athletes = await prisma.athlete.findMany({
    where: {
      athleteAssociations: {
        some: {
          user: {
            organization_id: orgId,
          },
        },
      },
    },

    select: {
      birth_date: true,
    },
  })

  const totalAge = athletes.reduce((sum, athlete) => {
    if (athlete.birth_date) {
      const age = dayjs().diff(dayjs(athlete.birth_date), 'year')

      return sum + age
    }

    return sum
  }, 0)

  if (totalAge && totalAge) {
    const amount = totalAge / athletes.length

    return reply.send({
      amount: Number(amount.toFixed(2)),
    })
  }

  return reply.send({
    amount: 0,
  })
}
