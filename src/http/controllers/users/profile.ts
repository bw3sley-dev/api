import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { transformNameToInitials } from '@/utils/transform-name-to-initials'

import dayjs from 'dayjs'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const orgId = request.user.meta.orgId

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
    },

    include: {
      address: true,
    },
  })

  if (!user) {
    return reply.status(403).send({
      message: 'Usuário não possui acesso.',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address_id: _, ..._user } = user

  return reply.send({
    ..._user,

    birth_date: _user.birth_date
      ? dayjs(_user.birth_date).format('YYYY-MM-DD')
      : null,

    initials: transformNameToInitials(user.name),
  })
}
