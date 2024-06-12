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

      owner: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!organization) {
    return reply.status(403).send({
      message: 'Você não possui acesso.',
      code: 'FORBIDDEN',
    })
  }

  return reply.send(organization)
}
