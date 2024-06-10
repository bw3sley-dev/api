import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function deleteOrg(request: FastifyRequest, reply: FastifyReply) {
  const orgId = request.user.meta.orgId

  const doesOrgExist = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  })

  if (!doesOrgExist) {
    return reply.status(404).send({
      message: 'Organização não encontrada.',
    })
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.organization.update({
      where: {
        id: orgId,
      },

      data: {
        status: false,
      },
    })

    await prisma.user.updateMany({
      where: {
        organization_id: orgId,
      },

      data: {
        status: false,
      },
    })

    await prisma.athlete.updateMany({
      where: {
        athleteAssociations: {
          some: {
            user: {
              organization_id: orgId,
            },
          },
        },
      },

      data: { status: false },
    })
  })

  return reply.status(204).send()
}
