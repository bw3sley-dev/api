import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function deleteVolunteer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const orgId = request.user.meta.orgId

  const updateStatusParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateStatusParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({
    where: {
      id,
      organization_id: orgId,
    },
  })

  if (!user) {
    return reply.status(404).send({
      message: 'Usuário não encontrado.',
    })
  }

  if (user.role !== 'VOLUNTEER') {
    return reply.status(409).send({
      message: 'Usuário não é um voluntário.',
    })
  }

  await prisma.user.delete({
    where: {
      id,
      organization_id: orgId,
    },
  })

  return reply.status(204).send()
}
