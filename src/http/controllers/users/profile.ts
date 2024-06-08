import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { transformNameToInitials } from '@/utils/transform-name-to-initials'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    include: {
      address: true,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Usuário não encontrado.',
    })
  }

  return reply.send({
    ...user,

    initials: transformNameToInitials(user.name),
  })
}
