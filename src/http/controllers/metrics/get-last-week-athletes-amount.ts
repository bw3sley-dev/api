import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import dayjs from 'dayjs'

export async function getAthletesLastWeekAmount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const today = dayjs()
  const lastWeek = today.subtract(7, 'day')

  const athletes = await prisma.athlete.findMany({
    where: {
      created_at: {
        gte: lastWeek.toDate(),
        lte: today.toDate(),
      },

      athleteAssociations: {
        some: {
          user: {
            organization_id: orgId,
          },
        },
      },
    },
  })

  const amount = Array.from({ length: 7 }).map((_, index) => {
    const date = lastWeek.add(index, 'day').format('YYYY-MM-DD')

    const count = athletes.filter(
      (athlete) => dayjs(athlete.created_at).format('YYYY-MM-DD') === date,
    ).length

    return { date, count }
  })

  return reply.send(amount)
}
