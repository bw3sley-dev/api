import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import dayjs from 'dayjs'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    pageIndex: z.coerce.number().min(0),
    athleteName: z.string().optional(),
    status: z.enum(['all', 'active', 'inactive']).default('all'),
  })

  const PAGE_SIZE = 10

  const { pageIndex, athleteName, status } = searchQuerySchema.parse(
    request.query,
  )

  let statusFilter

  if (status === 'active') {
    statusFilter = true
  } else if (status === 'inactive') {
    statusFilter = false
  }

  const athletes = await prisma.athlete.findMany({
    skip: pageIndex * PAGE_SIZE,
    take: PAGE_SIZE,

    where: {
      ...(athleteName && {
        name: { contains: athleteName, mode: 'insensitive' },
      }),
      ...(status !== 'all' && { status: statusFilter }),
    },

    select: {
      id: true,
      name: true,
      birth_date: true,
      handedness: true,
      gender: true,
      blood_type: true,
      status: true,
    },
  })

  const athletesCount = await prisma.athlete.count({
    where: {
      ...(athleteName && {
        name: { contains: athleteName, mode: 'insensitive' },
      }),
      ...(status !== 'all' && { status: statusFilter }),
    },
  })

  const allAthletes = athletes.map((athlete) => ({
    ...athlete,

    age: athlete.birth_date ? dayjs().diff(athlete.birth_date, 'year') : null,
    status: athlete.status ? 'active' : 'inactive',

    gender: athlete.gender?.toLocaleLowerCase(),
    handedness: athlete.handedness?.toLocaleLowerCase(),
    blood_type: athlete.blood_type?.toLocaleLowerCase(),
  }))

  const result = {
    athletes: allAthletes,

    meta: {
      pageIndex,
      perPage: PAGE_SIZE,
      totalCount: athletesCount,
    },
  }

  return reply.send(result)
}
