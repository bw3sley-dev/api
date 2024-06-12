/* eslint-disable @typescript-eslint/no-unused-vars */

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
      code: 'FORBIDDEN',
    })
  }

  const {
    address_id: _,
    password_hash: __,
    status: ___,

    birth_date,
    ..._user
  } = user

  return reply.send({
    ..._user,

    birthDate: birth_date ? dayjs(birth_date).format('YYYY-MM-DD') : null,

    initials: transformNameToInitials(user.name),
  })
}
