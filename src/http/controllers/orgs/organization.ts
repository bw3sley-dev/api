import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function organization(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },

    include: {
      address: true,
    },
  })

  if (!organization) {
    return reply.status(404).send({
      message: 'Organização não encontrada.',
    })
  }

  return reply.send(organization)
}
