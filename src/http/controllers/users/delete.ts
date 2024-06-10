import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  const orgId = request.user.meta.orgId

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      organization_id: orgId,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Usuário não encontrado.',
    })
  }

  await prisma.user.update({
    where: {
      id: userId,
      organization_id: orgId,
    },

    data: {
      status: false,
    },
  })

  return reply.status(204).send()
}
