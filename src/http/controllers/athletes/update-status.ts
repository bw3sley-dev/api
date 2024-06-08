import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

import { z } from 'zod'

export async function updateStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateStatusParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateStatusParamsSchema.parse(request.params)

  const athlete = await prisma.athlete.findUnique({
    where: {
      id,
    },

    select: {
      status: true,
    },
  })

  if (!athlete) {
    return reply.status(404).send({
      message: 'Atleta não encontrado',
    })
  }

  await prisma.athlete.update({
    where: {
      id,
    },

    data: {
      status: !athlete.status,
    },
  })

  return reply.status(204).send()
}
