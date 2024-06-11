import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import dayjs from 'dayjs'

export async function volunteers(request: FastifyRequest, reply: FastifyReply) {
  const orgId = request.user.meta.orgId

  const volunteers = await prisma.user.findMany({
    where: {
      organization_id: orgId,
      role: 'VOLUNTEER',
      status: true,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      area: true,
      status: true,
      created_at: true,
    },
  })

  const _volunteers = volunteers.map((volunteer) => ({
    ...volunteer,

    area: volunteer.area.toLocaleLowerCase(),
    access_date: dayjs(volunteer.created_at).format('YYYY-MM-DD HH:mm:ss'),
  }))

  return reply.send({
    volunteers: _volunteers,
  })
}
